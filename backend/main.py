"""
Pavagarh Temple CMS — FastAPI Backend
Main entry point
"""
import sys
import os

# Add backend venv packages to path if exists
venv_pkgs = os.path.join(os.path.dirname(__file__), "venv_packages")
if os.path.exists(venv_pkgs):
    sys.path.insert(0, venv_pkgs)

from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.core.limiter import limiter
from app.core.seeder import seed_initial_data
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

            def _migrate_columns(sync_conn):
                from sqlalchemy import inspect, text
                inspector = inspect(sync_conn)
                tables = inspector.get_table_names()
                if "trustees" in tables:
                    cols = {c["name"] for c in inspector.get_columns("trustees")}
                    new_cols = [
                        ("title", "VARCHAR(200)"),
                        ("role", "VARCHAR(200)"),
                        ("bio", "TEXT"),
                        ("photo_url", "VARCHAR(500)")
                    ]
                    for col_name, col_type in new_cols:
                        if col_name not in cols:
                            sync_conn.execute(text(f"ALTER TABLE trustees ADD COLUMN {col_name} {col_type}"))

            await conn.run_sync(_migrate_columns)

        await seed_initial_data()
    except Exception as e:
        print(f"Lifespan startup warning: {e}")

    yield

    try:
        await engine.dispose()
    except Exception:
        pass


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="CMS Backend for Pavagarh Temple Website",
        docs_url="/api/docs" if settings.DEBUG else None,
        redoc_url="/api/redoc" if settings.DEBUG else None,
        openapi_url="/api/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # Rate limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Total-Count"],
    )

    # Security headers middleware
    @app.middleware("http")
    async def security_headers(request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return response

    # Static file serving for uploads
    upload_path = os.path.join(os.path.dirname(__file__), settings.UPLOAD_DIR)
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        upload_path = "/tmp/uploads"

    try:
        os.makedirs(upload_path, exist_ok=True)
        if os.path.exists(upload_path):
            app.mount("/uploads", StaticFiles(directory=upload_path), name="uploads")
    except Exception as e:
        print(f"Uploads mount warning: {e}")

    # API Routes
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/health")
    async def health():
        return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}

    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info",
    )
