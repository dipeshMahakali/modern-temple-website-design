"""Admin Forms Config API"""
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log
from app.models.content import FormConfig

router = APIRouter()


@router.get("")
@router.get("/")
async def list_forms(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(FormConfig).order_by(FormConfig.slug.asc()))
    return list(result.scalars().all())


@router.get("/{slug}")
async def get_form_config(slug: str, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(FormConfig).where(FormConfig.slug == slug))
    form = result.scalar_one_or_none()
    if not form:
        raise HTTPException(status_code=404, detail="Form configuration not found")
    return form


@router.put("/{slug}")
async def update_form_config(
    slug: str,
    body: Dict[str, Any],
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(FormConfig).where(FormConfig.slug == slug))
    form = result.scalar_one_or_none()
    if not form:
        raise HTTPException(status_code=404, detail="Form configuration not found")

    old_data = {
        "title": form.title,
        "is_visible": form.is_visible,
        "fields": form.fields,
        "notifications": form.notifications
    }

    form.title = body.get("title", form.title)
    form.is_visible = body.get("is_visible", form.is_visible)
    form.fields = body.get("fields", form.fields)
    form.notifications = body.get("notifications", form.notifications)

    await db.commit()
    await db.refresh(form)

    new_data = {
        "title": form.title,
        "is_visible": form.is_visible,
        "fields": form.fields,
        "notifications": form.notifications
    }

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_form_config",
        entity_type="form_config",
        entity_id=form.id,
        entity_label=form.title,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return form
