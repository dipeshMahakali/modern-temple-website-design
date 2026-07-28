"""Admin Stats CRUD"""
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log
from app.models.content import StatItem
from app.schemas.schemas import StatItemOut, StatItemCreate, StatItemUpdate

router = APIRouter()


@router.get("/", response_model=List[StatItemOut])
async def list_stats(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(StatItem).where(StatItem.deleted_at == None).order_by(StatItem.display_order.asc()))
    return list(result.scalars().all())


@router.post("/", response_model=StatItemOut, status_code=status.HTTP_201_CREATED)
async def create_stat(
    body: StatItemCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    item = StatItem(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)

    # Audit log
    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="create_stat",
        entity_type="stat",
        entity_id=item.id,
        entity_label=item.label,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.patch("/{stat_id}", response_model=StatItemOut)
async def update_stat(
    stat_id: int,
    body: StatItemUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(StatItem).where(StatItem.id == stat_id, StatItem.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Stat item not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}

    for k, v in body.model_dump(exclude_none=True).items():
        setattr(item, k, v)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_stat",
        entity_type="stat",
        entity_id=stat_id,
        entity_label=item.label,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.delete("/{stat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stat(
    stat_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(StatItem).where(StatItem.id == stat_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Stat item not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await db.execute(delete(StatItem).where(StatItem.id == stat_id))
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="delete_stat",
        entity_type="stat",
        entity_id=stat_id,
        entity_label=item.label,
        old_value=old_data,
        request=request,
    )
    await db.commit()


@router.post("/{stat_id}/toggle-visibility", response_model=StatItemOut)
async def toggle_visibility(
    stat_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(StatItem).where(StatItem.id == stat_id, StatItem.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Stat item not found")

    old_val = {"is_visible": item.is_visible}
    item.is_visible = not item.is_visible
    new_val = {"is_visible": item.is_visible}

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="toggle_stat_visibility",
        entity_type="stat",
        entity_id=stat_id,
        entity_label=item.label,
        old_value=old_val,
        new_value=new_val,
        request=request,
    )
    await db.commit()
    return item


@router.post("/reorder")
async def reorder_stats(
    orders: Dict[int, int],
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    for s_id, order in orders.items():
        await db.execute(update(StatItem).where(StatItem.id == s_id).values(display_order=order))

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="reorder_stats",
        entity_type="stat",
        notes=f"Reordered stats: {str(orders)}",
        request=request,
    )
    await db.commit()
    return {"success": True}
