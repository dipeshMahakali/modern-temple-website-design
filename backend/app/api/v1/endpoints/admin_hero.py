"""Admin Hero Configuration API"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log, record_revision
from app.models.content import HeroConfig
from app.schemas.schemas import HeroConfigOut, HeroConfigUpdate

router = APIRouter()


@router.get("", response_model=HeroConfigOut)
@router.get("/", response_model=HeroConfigOut)
async def get_hero(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(
        select(HeroConfig)
        .where(HeroConfig.deleted_at == None)
        .order_by(HeroConfig.is_active.desc(), HeroConfig.id.desc())
        .limit(1)
    )
    hero = result.scalar_one_or_none()
    if not hero:
        # Create a default one if none exists
        hero = HeroConfig(
            heading="जय माँ बम्लेश्वरी",
            heading_devanagari="जय माँ बम्लेश्वरी",
            subtitle="Welcome to Dongargarh Maa Bamleshwari Temple",
            description="Explore one of Chhattisgarh's most revered Shakti Peeths.",
            bg_image_url="/assets/hero-bg.png",
            overlay_opacity=0.5,
            buttons=[],
            is_active=True
        )
        db.add(hero)
        await db.commit()
        await db.refresh(hero)
    return hero


@router.patch("", response_model=HeroConfigOut)
@router.patch("/", response_model=HeroConfigOut)
async def update_hero(
    body: HeroConfigUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    # Get active hero config
    result = await db.execute(
        select(HeroConfig)
        .where(HeroConfig.deleted_at == None)
        .order_by(HeroConfig.is_active.desc(), HeroConfig.id.desc())
        .limit(1)
    )
    hero = result.scalar_one_or_none()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero configuration not found")

    old_data = {c.name: getattr(hero, c.name) for c in hero.__table__.columns if c.name not in ["updated_at", "deleted_at"]}

    for k, v in body.model_dump(exclude_none=True).items():
        setattr(hero, k, v)
    await db.commit()
    await db.refresh(hero)

    new_data = {c.name: getattr(hero, c.name) for c in hero.__table__.columns if c.name not in ["updated_at", "deleted_at"]}
    
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_hero",
        entity_type="hero",
        entity_id=hero.id,
        entity_label=hero.heading,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await record_revision(
        db=db,
        entity_type="hero",
        entity_id=hero.id,
        data=new_data,
        user_id=current_user.id,
        comment="Updated Hero Banner configuration",
    )
    await db.commit()
    return hero
