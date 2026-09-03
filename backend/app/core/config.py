"""
Application Configuration
Uses Pydantic Settings for environment variable management
"""
import os
import json
import shutil
from typing import List, Any
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def get_default_database_url() -> str:
    env_db = (
        os.environ.get("DATABASE_URL")
        or os.environ.get("POSTGRES_URL")
        or os.environ.get("POSTGRES_URL_NON_POOLING")
        or os.environ.get("POSTGRES_PRISMA_URL")
    )
    if env_db:
        # Convert postgres:// or postgresql:// to postgresql+asyncpg:// for SQLAlchemy async engine
        if env_db.startswith("postgres://"):
            env_db = "postgresql+asyncpg://" + env_db[len("postgres://"):]
        elif env_db.startswith("postgresql://") and not env_db.startswith("postgresql+"):
            env_db = "postgresql+asyncpg://" + env_db[len("postgresql://"):]

        # Normalize query params for asyncpg (e.g. sslmode=require -> ssl=require)
        if "sslmode=require" in env_db:
            env_db = env_db.replace("sslmode=require", "ssl=require")
        elif "sslmode=prefer" in env_db:
            env_db = env_db.replace("sslmode=prefer", "ssl=prefer")
        elif "sslmode=disable" in env_db:
            env_db = env_db.replace("sslmode=disable", "ssl=disable")

        return env_db
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    seed_db = os.path.join(base_dir, "temple.db")

    # On Vercel serverless / AWS Lambda (read-only root), copy temple.db to /tmp
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        tmp_db = "/tmp/temple.db"
        if not os.path.exists(tmp_db):
            if os.path.exists(seed_db):
                shutil.copy2(seed_db, tmp_db)
        return f"sqlite+aiosqlite:///{tmp_db}"

    if os.path.exists(seed_db):
        return f"sqlite+aiosqlite:///{seed_db}"
    return "sqlite+aiosqlite:///./temple.db"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    APP_NAME: str = "Pavagarh Temple CMS"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # URLs
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:5173"

    # Database
    DATABASE_URL: str = ""
    DATABASE_URL_SYNC: str = "sqlite:///./temple.db"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_url(cls, v: Any) -> str:
        # Check non-pooling / unpooled env vars first for serverless Vercel Neon
        unpooled_env = (
            os.environ.get("DATABASE_URL_UNPOOLED")
            or os.environ.get("DATABASE_POSTGRES_URL_NON_POOLING")
            or os.environ.get("POSTGRES_URL_NON_POOLING")
        )
        if unpooled_env:
            v = unpooled_env
        elif not v:
            v = (
                os.environ.get("DATABASE_POSTGRES_URL")
                or os.environ.get("DATABASE_URL")
                or os.environ.get("POSTGRES_URL")
            )

        if not v or not isinstance(v, str):
            v = get_default_database_url()

        # Convert postgres:// or postgresql:// scheme to postgresql+asyncpg://
        if v.startswith("postgres://"):
            v = "postgresql+asyncpg://" + v[len("postgres://"):]
        elif v.startswith("postgresql://") and not v.startswith("postgresql+"):
            v = "postgresql+asyncpg://" + v[len("postgresql://"):]

        # Normalize query params for asyncpg
        if "sslmode=require" in v:
            v = v.replace("sslmode=require", "ssl=require")
        elif "sslmode=prefer" in v:
            v = v.replace("sslmode=prefer", "ssl=prefer")
        elif "sslmode=disable" in v:
            v = v.replace("sslmode=disable", "ssl=disable")

        return v

    # JWT
    SECRET_KEY: str = "pavagarh_temple_super_secret_key_change_in_production_256bit_strong"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Cookie
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"

    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10

    # Rate Limiting
    LOGIN_RATE_LIMIT: str = "5/minute"
    API_RATE_LIMIT: str = "100/minute"

    # Account Security
    MAX_FAILED_ATTEMPTS: int = 5
    LOCKOUT_MINUTES: int = 30

    # Seeded Admin
    SUPER_ADMIN_EMAIL: str = "admin@temple.com"
    SUPER_ADMIN_PASSWORD: str = "Admin@123!"
    SUPER_ADMIN_NAME: str = "Temple Administrator"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


settings = Settings()
