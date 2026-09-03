"""Admin Sections CRUD"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log, record_revision
from app.repositories.content import SectionRepository
from app.schemas.schemas import SectionOut, SectionCreate, SectionUpdate
from app.models.content import Section

router = APIRouter()


@router.get("", response_model=List[SectionOut])
@router.get("/", response_model=List[SectionOut])
async def list_sections(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = SectionRepository(db)
    return await repo.get_all()


@router.post("", response_model=SectionOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=SectionOut, status_code=status.HTTP_201_CREATED)
async def create_section(
    body: SectionCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = SectionRepository(db)
    existing = await repo.get_by_slug(body.slug)
    if existing:
        raise HTTPException(status_code=400, detail=f"Section with slug '{body.slug}' already exists")
    
    # Set created_by
    kwargs = body.model_dump()
    kwargs["created_by_id"] = current_user.id
    section = await repo.create(**kwargs)
    
    # Audit log
    new_data = {c.name: getattr(section, c.name) for c in section.__table__.columns if c.name != "created_at" and c.name != "updated_at"}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="create_section",
        entity_type="section",
        entity_id=section.id,
        entity_label=section.title,
        new_value=new_data,
        request=request,
    )
    await record_revision(
        db=db,
        entity_type="section",
        entity_id=section.id,
        data=new_data,
        user_id=current_user.id,
        comment="Initial creation",
    )
    await db.commit()
    return section


@router.get("/{section_id}", response_model=SectionOut)
async def get_section(
    section_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = SectionRepository(db)
    section = await repo.get_by_id(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


@router.patch("/{section_id}", response_model=SectionOut)
async def update_section(
    section_id: int,
    body: SectionUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = SectionRepository(db)
    section = await repo.get_by_id(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    old_data = {c.name: getattr(section, c.name) for c in section.__table__.columns if c.name != "created_at" and c.name != "updated_at"}
    
    kwargs = body.model_dump(exclude_none=True)
    kwargs["updated_by_id"] = current_user.id
    updated = await repo.update(section_id, **kwargs)
    
    new_data = {c.name: getattr(updated, c.name) for c in updated.__table__.columns if c.name != "created_at" and c.name != "updated_at"}
    
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_section",
        entity_type="section",
        entity_id=section_id,
        entity_label=updated.title,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await record_revision(
        db=db,
        entity_type="section",
        entity_id=section_id,
        data=new_data,
        user_id=current_user.id,
        comment="Updated section attributes",
    )
    await db.commit()
    return updated


@router.delete("/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_section(
    section_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = SectionRepository(db)
    section = await repo.get_by_id(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    old_data = {c.name: getattr(section, c.name) for c in section.__table__.columns if c.name != "created_at" and c.name != "updated_at"}
    await repo.delete(section_id)
    
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="delete_section",
        entity_type="section",
        entity_id=section_id,
        entity_label=section.title,
        old_value=old_data,
        request=request,
    )
    await db.commit()


@router.post("/{section_id}/toggle-visibility", response_model=SectionOut)
async def toggle_visibility(
    section_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = SectionRepository(db)
    section = await repo.get_by_id(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    old_data = {"is_visible": section.is_visible}
    new_visible = not section.is_visible
    updated = await repo.update(section_id, is_visible=new_visible)
    new_data = {"is_visible": new_visible}
    
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="toggle_section_visibility",
        entity_type="section",
        entity_id=section_id,
        entity_label=updated.title,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return updated


@router.post("/reorder")
async def reorder_sections(
    orders: Dict[int, int],
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    """Update display order for multiple sections in bulk"""
    for section_id, new_order in orders.items():
        await db.execute(
            update(Section)
            .where(Section.id == section_id)
            .values(display_order=new_order)
        )
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="reorder_sections",
        entity_type="section",
        notes=f"Reordered sections: {str(orders)}",
        request=request,
    )
    await db.commit()
    return {"success": True}
