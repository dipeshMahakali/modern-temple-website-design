"""Admin Testimonials CRUD"""
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log
from app.models.content import Testimonial
from app.schemas.schemas import TestimonialOut, TestimonialCreate, TestimonialUpdate

router = APIRouter()


@router.get("", response_model=List[TestimonialOut])
@router.get("/", response_model=List[TestimonialOut])
async def list_testimonials(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(Testimonial).where(Testimonial.deleted_at == None).order_by(Testimonial.display_order.asc()))
    return list(result.scalars().all())


@router.post("", response_model=TestimonialOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=TestimonialOut, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    body: TestimonialCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    item = Testimonial(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="create_testimonial",
        entity_type="testimonial",
        entity_id=item.id,
        entity_label=item.name,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.patch("/{testimonial_id}", response_model=TestimonialOut)
async def update_testimonial(
    testimonial_id: int,
    body: TestimonialUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(Testimonial).where(Testimonial.id == testimonial_id, Testimonial.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}

    for k, v in body.model_dump(exclude_none=True).items():
        setattr(item, k, v)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_testimonial",
        entity_type="testimonial",
        entity_id=testimonial_id,
        entity_label=item.name,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(
    testimonial_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(Testimonial).where(Testimonial.id == testimonial_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await db.execute(delete(Testimonial).where(Testimonial.id == testimonial_id))
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="delete_testimonial",
        entity_type="testimonial",
        entity_id=testimonial_id,
        entity_label=item.name,
        old_value=old_data,
        request=request,
    )
    await db.commit()


@router.post("/{testimonial_id}/toggle-visibility", response_model=TestimonialOut)
async def toggle_visibility(
    testimonial_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(Testimonial).where(Testimonial.id == testimonial_id, Testimonial.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    old_val = {"is_visible": item.is_visible}
    item.is_visible = not item.is_visible
    new_val = {"is_visible": item.is_visible}

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="toggle_testimonial_visibility",
        entity_type="testimonial",
        entity_id=testimonial_id,
        entity_label=item.name,
        old_value=old_val,
        new_value=new_val,
        request=request,
    )
    await db.commit()
    return item


@router.post("/reorder")
async def reorder_testimonials(
    orders: Dict[int, int],
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    for t_id, order in orders.items():
        await db.execute(update(Testimonial).where(Testimonial.id == t_id).values(display_order=order))

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="reorder_testimonials",
        entity_type="testimonial",
        notes=f"Reordered testimonials: {str(orders)}",
        request=request,
    )
    await db.commit()
    return {"success": True}
