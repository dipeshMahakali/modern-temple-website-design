"""
Public Content API Endpoints
Consumed by the public-facing React frontend
All endpoints filter by is_visible/is_enabled
"""
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.repositories.content import (
    PageRepository, SectionRepository, TimelineRepository,
    GalleryRepository, EventRepository, NavigationRepository,
    TempleInfoRepository, SeoRepository
)
from app.models.content import (
    Page, PageStatus, Section, HeroConfig, StatItem,
    Trustee, Testimonial, InstructionRule, InstructionDetail,
    ServiceItem, BankDetail, TempleTiming
)
from app.schemas.schemas import (
    HeroConfigOut, StatItemOut, TrusteeOut, TestimonialOut,
    InstructionRuleOut, InstructionDetailOut, ServiceItemOut,
    BankDetailOut, TempleTimingOut
)

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
    """Returns visible navigation items for the frontend, filtering disabled pages"""
    repo = NavigationRepository(db)
    items = await repo.get_all(visible_only=True, location=location)
    
    # Filter out items pointing to disabled/draft pages
    from app.models.content import Page, PageStatus
    page_res = await db.execute(
        select(Page.slug).where((Page.is_enabled == False) | (Page.status != PageStatus.published))
    )
    disabled_slugs = set(page_res.scalars().all())
    
    return [item for item in items if item.slug not in disabled_slugs]



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


# ─── Newly Added Public Routes ────────────────────────────────────────────────

@router.get("/hero", response_model=Optional[HeroConfigOut])
async def get_hero(db: AsyncSession = Depends(get_db)):
    """Returns the active hero configuration"""
    result = await db.execute(
        select(HeroConfig)
        .where(HeroConfig.deleted_at == None)
        .order_by(HeroConfig.is_active.desc(), HeroConfig.id.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


@router.get("/stats", response_model=List[StatItemOut])
async def get_stats(db: AsyncSession = Depends(get_db)):
    """Returns visible stats ordered by display_order"""
    result = await db.execute(
        select(StatItem)
        .where(StatItem.is_visible == True)
        .where(StatItem.deleted_at == None)
        .order_by(StatItem.display_order.asc(), StatItem.id.asc())
    )
    return list(result.scalars().all())


@router.get("/trustees", response_model=List[TrusteeOut])
async def get_trustees(db: AsyncSession = Depends(get_db)):
    """Returns visible trustees ordered by display_order"""
    result = await db.execute(
        select(Trustee)
        .where(Trustee.is_visible == True)
        .where(Trustee.deleted_at == None)
        .order_by(Trustee.display_order.asc(), Trustee.id.asc())
    )
    return list(result.scalars().all())


@router.get("/testimonials", response_model=List[TestimonialOut])
async def get_testimonials(db: AsyncSession = Depends(get_db)):
    """Returns visible testimonials ordered by display_order"""
    result = await db.execute(
        select(Testimonial)
        .where(Testimonial.is_visible == True)
        .where(Testimonial.deleted_at == None)
        .order_by(Testimonial.display_order.asc(), Testimonial.id.asc())
    )
    return list(result.scalars().all())


@router.get("/instructions")
async def get_instructions(db: AsyncSession = Depends(get_db)):
    """Returns rules and details for the instructions page"""
    rules_res = await db.execute(
        select(InstructionRule)
        .where(InstructionRule.is_visible == True)
        .where(InstructionRule.deleted_at == None)
        .order_by(InstructionRule.display_order.asc())
    )
    details_res = await db.execute(
        select(InstructionDetail)
        .where(InstructionDetail.is_visible == True)
        .where(InstructionDetail.deleted_at == None)
        .order_by(InstructionDetail.display_order.asc())
    )
    return {
        "rules": list(rules_res.scalars().all()),
        "details": list(details_res.scalars().all())
    }


@router.get("/services", response_model=List[ServiceItemOut])
async def get_services(db: AsyncSession = Depends(get_db)):
    """Returns visible services ordered by display_order"""
    result = await db.execute(
        select(ServiceItem)
        .where(ServiceItem.is_visible == True)
        .where(ServiceItem.deleted_at == None)
        .order_by(ServiceItem.display_order.asc(), ServiceItem.id.asc())
    )
    return list(result.scalars().all())


@router.get("/bank-details", response_model=List[BankDetailOut])
async def get_bank_details(db: AsyncSession = Depends(get_db)):
    """Returns visible bank details ordered by display_order"""
    result = await db.execute(
        select(BankDetail)
        .where(BankDetail.is_visible == True)
        .where(BankDetail.deleted_at == None)
        .order_by(BankDetail.display_order.asc(), BankDetail.id.asc())
    )
    return list(result.scalars().all())


@router.get("/timings", response_model=List[TempleTimingOut])
async def get_timings(db: AsyncSession = Depends(get_db)):
    """Returns visible temple timings ordered by display_order"""
    result = await db.execute(
        select(TempleTiming)
        .where(TempleTiming.is_visible == True)
        .where(TempleTiming.deleted_at == None)
        .order_by(TempleTiming.display_order.asc(), TempleTiming.id.asc())
    )
    return list(result.scalars().all())


@router.get("/sections-list")
async def get_sections_list(db: AsyncSession = Depends(get_db)):
    """Returns sorted visible sections with styling config"""
    result = await db.execute(
        select(Section)
        .where(Section.is_visible == True)
        .order_by(Section.display_order.asc())
    )
    sections = result.scalars().all()
    return [
        {
            "id": s.id,
            "slug": s.slug,
            "title": s.title,
            "is_visible": s.is_visible,
            "display_order": s.display_order,
            "background": s.background,
            "animation": s.animation,
            "spacing": s.spacing,
            "config": s.config,
        }
        for s in sections
    ]


@router.get("/forms/{slug}")
async def get_public_form_config(slug: str, db: AsyncSession = Depends(get_db)):
    """Returns public form configuration by slug"""
    from app.models.content import FormConfig
    from fastapi import HTTPException
    result = await db.execute(
        select(FormConfig)
        .where(FormConfig.slug == slug)
        .where(FormConfig.is_visible == True)
    )
    form = result.scalar_one_or_none()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found or disabled")
    return {
        "slug": form.slug,
        "title": form.title,
        "is_visible": form.is_visible,
        "fields": form.fields
    }

