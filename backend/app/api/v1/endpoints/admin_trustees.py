"""Admin Trustees CRUD"""
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log
from app.models.content import Trustee
from app.schemas.schemas import TrusteeOut, TrusteeCreate, TrusteeUpdate

router = APIRouter()


@router.get("/", response_model=List[TrusteeOut])
async def list_trustees(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(Trustee).where(Trustee.deleted_at == None).order_by(Trustee.display_order.asc()))
    return list(result.scalars().all())


@router.post("/", response_model=TrusteeOut, status_code=status.HTTP_201_CREATED)
async def create_trustee(
    body: TrusteeCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    item = Trustee(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="create_trustee",
        entity_type="trustee",
        entity_id=item.id,
        entity_label=item.name,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.patch("/{trustee_id}", response_model=TrusteeOut)
async def update_trustee(
    trustee_id: int,
    body: TrusteeUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(Trustee).where(Trustee.id == trustee_id, Trustee.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Trustee not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}

    for k, v in body.model_dump(exclude_none=True).items():
        setattr(item, k, v)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_trustee",
        entity_type="trustee",
        entity_id=trustee_id,
        entity_label=item.name,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.delete("/{trustee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trustee(
    trustee_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(Trustee).where(Trustee.id == trustee_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Trustee not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await db.execute(delete(Trustee).where(Trustee.id == trustee_id))
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="delete_trustee",
        entity_type="trustee",
        entity_id=trustee_id,
        entity_label=item.name,
        old_value=old_data,
        request=request,
    )
    await db.commit()


@router.post("/{trustee_id}/toggle-visibility", response_model=TrusteeOut)
async def toggle_visibility(
    trustee_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(Trustee).where(Trustee.id == trustee_id, Trustee.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Trustee not found")

    old_val = {"is_visible": item.is_visible}
    item.is_visible = not item.is_visible
    new_val = {"is_visible": item.is_visible}

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="toggle_trustee_visibility",
        entity_type="trustee",
        entity_id=trustee_id,
        entity_label=item.name,
        old_value=old_val,
        new_value=new_val,
        request=request,
    )
    await db.commit()
    return item


@router.post("/reorder")
async def reorder_trustees(
    orders: Dict[int, int],
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    for t_id, order in orders.items():
        await db.execute(update(Trustee).where(Trustee.id == t_id).values(display_order=order))

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="reorder_trustees",
        entity_type="trustee",
        notes=f"Reordered trustees: {str(orders)}",
        request=request,
    )
    await db.commit()
    return {"success": True}
