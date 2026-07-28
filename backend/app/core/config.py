"""
Application Configuration
Uses Pydantic Settings for environment variable management
"""
import json
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


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
    DATABASE_URL: str = "postgresql+asyncpg://temple_user:temple_pass@localhost:5432/temple_db"
    DATABASE_URL_SYNC: str = "postgresql+psycopg2://temple_user:temple_pass@localhost:5432/temple_db"

    # JWT
    SECRET_KEY: str = "change_this_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Cookie
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"

    # CORS - stored as JSON string in env
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

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
