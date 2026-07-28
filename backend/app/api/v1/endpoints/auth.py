"""
Authentication Endpoints
- Login with rate limiting + brute force protection
- Logout (revoke session)
- Logout All Devices
- Refresh token
- Get current user
"""
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import (
    verify_password, create_access_token,
    create_refresh_token, set_refresh_cookie,
    clear_refresh_cookie, get_refresh_token_from_cookie,
)
from app.core.deps import get_current_user
from app.core.config import settings
from app.core.limiter import limiter
from app.repositories.user import UserRepository
from app.schemas.schemas import LoginRequest, TokenResponse, UserOut

router = APIRouter()


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(
    request: Request,
    response: Response,
    body: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    repo = UserRepository(db)
    ip = _get_client_ip(request)
    user_agent = request.headers.get("User-Agent", "")
    email = body.email.lower().strip()

    # Find user
    user = await repo.get_by_email(email)

    if not user:
        await repo.log_login(email, "failed", ip, user_agent, failure_reason="User not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check if locked
    if user.locked_at is not None:
        lockout_end = user.locked_at + timedelta(minutes=settings.LOCKOUT_MINUTES)
        if lockout_end.tzinfo is None:
            lockout_end = lockout_end.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) < lockout_end:
            remaining = int((lockout_end - datetime.now(timezone.utc)).total_seconds() // 60)
            await repo.log_login(email, "locked", ip, user_agent, user_id=user.id, failure_reason="Account locked")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account locked. Try again in {remaining} minutes."
            )
        else:
            await repo.unlock_user(user.id)

    # Check account active
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    # Verify password
    if not verify_password(body.password, user.hashed_password):
        failed_count = await repo.increment_failed_attempts(user.id)
        if failed_count >= settings.MAX_FAILED_ATTEMPTS:
            await repo.lock_user(user.id)
            await repo.log_login(email, "locked", ip, user_agent, user_id=user.id, failure_reason="Too many failed attempts")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account locked after {settings.MAX_FAILED_ATTEMPTS} failed attempts"
            )
        await repo.log_login(email, "failed", ip, user_agent, user_id=user.id, failure_reason="Wrong password")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid email or password. {settings.MAX_FAILED_ATTEMPTS - failed_count} attempts remaining."
        )

    # Successful login
    await repo.update_last_login(user.id)

    # Create tokens
    access_token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role.value})
    refresh_token = create_refresh_token()

    # Store session
    device_info = user_agent[:500]
    await repo.create_session(user.id, refresh_token, device_info, ip)

    # Log success
    await repo.log_login(email, "success", ip, user_agent, user_id=user.id)

    # Set refresh token in httpOnly cookie
    set_refresh_cookie(response, refresh_token)

    return TokenResponse(
        access_token=access_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    refresh_token = get_refresh_token_from_cookie(request)
    if refresh_token:
        repo = UserRepository(db)
        session = await repo.get_session_by_token(refresh_token)
        if session:
            await repo.revoke_session(session.id)
    clear_refresh_cookie(response)
    return {"message": "Logged out successfully"}


@router.post("/logout-all")
async def logout_all(
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = UserRepository(db)
    await repo.revoke_all_sessions(current_user.id)
    clear_refresh_cookie(response)
    return {"message": "Logged out from all devices"}


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    token = get_refresh_token_from_cookie(request)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    repo = UserRepository(db)
    session = await repo.get_session_by_token(token)
    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    # Check expiry
    expires_at = session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        await repo.revoke_session(session.id)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    user = await repo.get_by_id(session.user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    # Rotate refresh token
    await repo.revoke_session(session.id)
    new_refresh = create_refresh_token()
    ip = _get_client_ip(request)
    await repo.create_session(user.id, new_refresh, session.device_info, ip)
    set_refresh_cookie(response, new_refresh)

    access_token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role.value})
    return TokenResponse(access_token=access_token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)


@router.get("/me", response_model=UserOut)
async def get_me(current_user=Depends(get_current_user)):
    return current_user


@router.get("/sessions")
async def get_my_sessions(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = UserRepository(db)
    sessions = await repo.get_user_sessions(current_user.id)
    return [{"id": s.id, "device_info": s.device_info, "ip_address": s.ip_address, "created_at": s.created_at} for s in sessions]


@router.get("/login-history")
async def get_login_history(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = UserRepository(db)
    history = await repo.get_login_history(current_user.id)
    return history
