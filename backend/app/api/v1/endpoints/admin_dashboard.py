"""Admin Dashboard Stats"""
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone

from app.core.database import get_db
from app.core.deps import require_admin
from app.models.content import Page, GalleryItem, Event, ContactMessage, PageStatus
from app.models.user import User, LoginHistory
from app.schemas.schemas import DashboardStats

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_admin),
):
    # Pages
    total_pages = (await db.execute(select(func.count()).select_from(Page))).scalar_one()
    published_pages = (await db.execute(select(func.count()).select_from(Page).where(
        Page.status == PageStatus.published, Page.is_enabled == True
    ))).scalar_one()
    hidden_pages = total_pages - published_pages

    # Gallery
    gallery_images = (await db.execute(select(func.count()).select_from(GalleryItem))).scalar_one()

    # Events
    events_count = (await db.execute(select(func.count()).select_from(Event))).scalar_one()

    # Messages
    unread_messages = (await db.execute(select(func.count()).select_from(ContactMessage).where(
        ContactMessage.is_read == False
    ))).scalar_one()

    # Users
    total_users = (await db.execute(select(func.count()).select_from(User))).scalar_one()

    # Recent logins (last 24h)
    since = datetime.now(timezone.utc) - timedelta(hours=24)
    recent_logins = (await db.execute(select(func.count()).select_from(LoginHistory).where(
        LoginHistory.created_at >= since, LoginHistory.status == "success"
    ))).scalar_one()

    return DashboardStats(
        total_pages=total_pages,
        published_pages=published_pages,
        hidden_pages=hidden_pages,
        gallery_images=gallery_images,
        events=events_count,
        unread_messages=unread_messages,
        total_users=total_users,
        recent_logins=recent_logins,
    )


@router.get("/recent-activity")
async def get_recent_activity(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_admin),
):
    from app.models.audit import AuditLog
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(AuditLog).order_by(AuditLog.created_at.desc()).limit(20)
    )
    logs = result.scalars().all()
    return logs
