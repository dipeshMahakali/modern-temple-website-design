"""
FastAPI Dependency Injection
- Current user from JWT
- Role/permission guards
- DB session
"""
from typing import Optional
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token


bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
):
    """Extract and validate JWT, return user dict"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    # Import here to avoid circular imports
    from app.repositories.user import UserRepository
    repo = UserRepository(db)
    user = await repo.get_by_id(int(user_id))

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")
    if user.locked_at is not None:
        from datetime import datetime, timezone, timedelta
        from app.core.config import settings
        lockout_end = user.locked_at + timedelta(minutes=settings.LOCKOUT_MINUTES)
        if lockout_end.tzinfo is None:
            lockout_end = lockout_end.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) < lockout_end:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is temporarily locked")
        # Auto-unlock
        await repo.unlock_user(user.id)

    return user


def require_roles(*roles: str):
    """Dependency factory: require one of the given roles"""
    async def _check(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role(s): {', '.join(roles)}"
            )
        return current_user
    return _check


# Convenience role guards
require_admin = require_roles("super_admin", "temple_admin")
require_editor = require_roles("super_admin", "temple_admin", "editor")
require_super_admin = require_roles("super_admin")
