"""
Public Content API Endpoints
Consumed by the public-facing React frontend
All endpoints filter by is_visible/is_enabled
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.repositories.content import (
    PageRepository, SectionRepository, TimelineRepository,
    GalleryRepository, EventRepository, NavigationRepository,
    TempleInfoRepository, SeoRepository
)
from app.models.content import Page, PageStatus, Section

router = APIRouter()


@router.get("/page-status/{slug}")
async def get_page_status(slug: str, db: AsyncSession = Depends(get_db)):
    """Check if a page is enabled and published — used by frontend gating"""
    repo = PageRepository(db)
    page = await repo.get_by_slug(slug)
    if not page:
        return {"slug": slug, "is_available": True}  # default: show if not managed
    return {
        "slug": slug,
        "is_available": page.is_enabled and page.status == PageStatus.published,
        "status": page.status,
    }


@router.get("/navigation")
async def get_navigation(
    location: Optional[str] = Query(None, description="main | footer | both"),
    db: AsyncSession = Depends(get_db),
):
    """Returns visible navigation items for the frontend"""
    repo = NavigationRepository(db)
    items = await repo.get_all(visible_only=True, location=location)
    return items


@router.get("/timeline")
async def get_timeline(db: AsyncSession = Depends(get_db)):
    """Returns visible timeline entries ordered by display_order"""
    repo = TimelineRepository(db)
    entries = await repo.get_all(visible_only=True)
    return entries


@router.get("/gallery")
async def get_gallery(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Returns visible gallery items, optionally filtered by category"""
    repo = GalleryRepository(db)
    items, _ = await repo.get_all(category=category, visible_only=True, limit=200)
    return items


@router.get("/events")
async def get_events(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Returns visible events sorted by date"""
    repo = EventRepository(db)
    events, _ = await repo.get_all(visible_only=True, limit=limit)
    return events


@router.get("/temple-info")
async def get_temple_info(
    group: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Returns temple information key-value pairs"""
    repo = TempleInfoRepository(db)
    info = await repo.get_all(group=group)
    return {item.key: item.value for item in info}


@router.get("/seo/{page_slug}")
async def get_seo(page_slug: str, db: AsyncSession = Depends(get_db)):
    """Returns SEO metadata for a given page slug"""
    repo = SeoRepository(db)
    entry = await repo.get_by_slug(page_slug)
    if not entry:
        return {}
    return entry


@router.get("/sections")
async def get_sections(db: AsyncSession = Depends(get_db)):
    """Returns visible section config — frontend uses this to skip hidden sections"""
    repo = SectionRepository(db)
    sections = await repo.get_all(visible_only=True)
    return {s.slug: {"is_visible": s.is_visible, "display_order": s.display_order} for s in sections}


@router.get("/all-sections")
async def get_all_sections_visibility(db: AsyncSession = Depends(get_db)):
    """Returns ALL section slugs with visibility — used for conditional rendering"""
    repo = SectionRepository(db)
    sections = await repo.get_all()
    return {s.slug: s.is_visible for s in sections}
