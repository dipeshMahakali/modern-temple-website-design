"""Admin Timings CRUD"""
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log
from app.models.content import TempleTiming
from app.schemas.schemas import TempleTimingOut, TempleTimingCreate, TempleTimingUpdate

router = APIRouter()


@router.get("/", response_model=List[TempleTimingOut])
async def list_timings(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(TempleTiming).where(TempleTiming.deleted_at == None).order_by(TempleTiming.display_order.asc()))
    return list(result.scalars().all())


@router.post("/", response_model=TempleTimingOut, status_code=status.HTTP_201_CREATED)
async def create_timing(
    body: TempleTimingCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    item = TempleTiming(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="create_timing",
        entity_type="timing",
        entity_id=item.id,
        entity_label=item.day_type,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.patch("/{timing_id}", response_model=TempleTimingOut)
async def update_timing(
    timing_id: int,
    body: TempleTimingUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(TempleTiming).where(TempleTiming.id == timing_id, TempleTiming.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Temple timing not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}

    for k, v in body.model_dump(exclude_none=True).items():
        setattr(item, k, v)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_timing",
        entity_type="timing",
        entity_id=timing_id,
        entity_label=item.day_type,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.delete("/{timing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_timing(
    timing_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(TempleTiming).where(TempleTiming.id == timing_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Temple timing not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await db.execute(delete(TempleTiming).where(TempleTiming.id == timing_id))
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="delete_timing",
        entity_type="timing",
        entity_id=timing_id,
        entity_label=item.day_type,
        old_value=old_data,
        request=request,
    )
    await db.commit()


@router.post("/{timing_id}/toggle-visibility", response_model=TempleTimingOut)
async def toggle_visibility(
    timing_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(TempleTiming).where(TempleTiming.id == timing_id, TempleTiming.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Temple timing not found")

    old_val = {"is_visible": item.is_visible}
    item.is_visible = not item.is_visible
    new_val = {"is_visible": item.is_visible}

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="toggle_timing_visibility",
        entity_type="timing",
        entity_id=timing_id,
        entity_label=item.day_type,
        old_value=old_val,
        new_value=new_val,
        request=request,
    )
    await db.commit()
    return item


@router.post("/reorder")
async def reorder_timings(
    orders: Dict[int, int],
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    for t_id, order in orders.items():
        await db.execute(update(TempleTiming).where(TempleTiming.id == t_id).values(display_order=order))

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="reorder_timings",
        entity_type="timing",
        notes=f"Reordered timings: {str(orders)}",
        request=request,
    )
    await db.commit()
    return {"success": True}
