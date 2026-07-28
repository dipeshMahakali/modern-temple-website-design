"""
User Repository — data access for User, Session, LoginHistory
"""
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Tuple
from sqlalchemy import select, update, delete, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, Session, LoginHistory, UserRole
from app.core.config import settings
from app.core.security import hash_password, hash_refresh_token


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email.lower().strip()))
        return result.scalar_one_or_none()

    async def create(self, email: str, full_name: str, password: str, role: UserRole = UserRole.viewer) -> User:
        user = User(
            email=email.lower().strip(),
            full_name=full_name,
            hashed_password=hash_password(password),
            role=role,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update_last_login(self, user_id: int) -> None:
        await self.db.execute(
            update(User).where(User.id == user_id).values(
                last_login_at=datetime.now(timezone.utc),
                failed_attempts=0,
                locked_at=None,
            )
        )
        await self.db.commit()

    async def increment_failed_attempts(self, user_id: int) -> int:
        result = await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(failed_attempts=User.failed_attempts + 1)
            .returning(User.failed_attempts)
        )
        await self.db.commit()
        row = result.fetchone()
        return row[0] if row else 0

    async def lock_user(self, user_id: int) -> None:
        await self.db.execute(
            update(User).where(User.id == user_id).values(locked_at=datetime.now(timezone.utc))
        )
        await self.db.commit()

    async def unlock_user(self, user_id: int) -> None:
        await self.db.execute(
            update(User).where(User.id == user_id).values(
                locked_at=None, failed_attempts=0
            )
        )
        await self.db.commit()

    async def get_all(self, skip: int = 0, limit: int = 50) -> Tuple[List[User], int]:
        count_result = await self.db.execute(select(func.count()).select_from(User))
        total = count_result.scalar_one()
        result = await self.db.execute(select(User).offset(skip).limit(limit).order_by(User.created_at.desc()))
        return result.scalars().all(), total

    async def update(self, user_id: int, **kwargs) -> Optional[User]:
        if "password" in kwargs:
            kwargs["hashed_password"] = hash_password(kwargs.pop("password"))
        await self.db.execute(update(User).where(User.id == user_id).values(**kwargs))
        await self.db.commit()
        return await self.get_by_id(user_id)

    async def deactivate(self, user_id: int) -> None:
        await self.db.execute(update(User).where(User.id == user_id).values(is_active=False))
        await self.db.commit()

    # ── Sessions ─────────────────────────────────────────────────────────────
    async def create_session(
        self, user_id: int, refresh_token: str, device_info: str, ip: str
    ) -> Session:
        session = Session(
            user_id=user_id,
            refresh_token_hash=hash_refresh_token(refresh_token),
            device_info=device_info,
            ip_address=ip,
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def get_session_by_token(self, refresh_token: str) -> Optional[Session]:
        token_hash = hash_refresh_token(refresh_token)
        result = await self.db.execute(
            select(Session).where(
                and_(Session.refresh_token_hash == token_hash, Session.is_revoked == False)
            )
        )
        return result.scalar_one_or_none()

    async def revoke_session(self, session_id: int) -> None:
        await self.db.execute(update(Session).where(Session.id == session_id).values(is_revoked=True))
        await self.db.commit()

    async def revoke_all_sessions(self, user_id: int) -> None:
        await self.db.execute(update(Session).where(Session.user_id == user_id).values(is_revoked=True))
        await self.db.commit()

    async def get_user_sessions(self, user_id: int) -> List[Session]:
        result = await self.db.execute(
            select(Session).where(
                and_(Session.user_id == user_id, Session.is_revoked == False)
            ).order_by(Session.created_at.desc())
        )
        return result.scalars().all()

    # ── Login History ──────────────────────────────────────────────────────────
    async def log_login(
        self,
        email: str,
        status: str,
        ip: str,
        user_agent: str,
        user_id: Optional[int] = None,
        failure_reason: Optional[str] = None,
    ) -> None:
        entry = LoginHistory(
            user_id=user_id,
            email_attempted=email,
            ip_address=ip,
            user_agent=user_agent,
            status=status,
            failure_reason=failure_reason,
        )
        self.db.add(entry)
        await self.db.commit()

    async def get_login_history(self, user_id: int, limit: int = 20) -> List[LoginHistory]:
        result = await self.db.execute(
            select(LoginHistory)
            .where(LoginHistory.user_id == user_id)
            .order_by(LoginHistory.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()
