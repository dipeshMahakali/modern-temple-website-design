"""Admin Services CRUD"""
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log
from app.models.content import ServiceItem
from app.schemas.schemas import ServiceItemOut, ServiceItemCreate, ServiceItemUpdate

router = APIRouter()


@router.get("", response_model=List[ServiceItemOut])
@router.get("/", response_model=List[ServiceItemOut])
async def list_services(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(ServiceItem).where(ServiceItem.deleted_at == None).order_by(ServiceItem.display_order.asc()))
    return list(result.scalars().all())


@router.post("", response_model=ServiceItemOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ServiceItemOut, status_code=status.HTTP_201_CREATED)
async def create_service(
    body: ServiceItemCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    item = ServiceItem(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="create_service",
        entity_type="service",
        entity_id=item.id,
        entity_label=item.title,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.patch("/{service_id}", response_model=ServiceItemOut)
async def update_service(
    service_id: int,
    body: ServiceItemUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(ServiceItem).where(ServiceItem.id == service_id, ServiceItem.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Service item not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}

    for k, v in body.model_dump(exclude_none=True).items():
        setattr(item, k, v)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_service",
        entity_type="service",
        entity_id=service_id,
        entity_label=item.title,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(ServiceItem).where(ServiceItem.id == service_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Service item not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await db.execute(delete(ServiceItem).where(ServiceItem.id == service_id))
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="delete_service",
        entity_type="service",
        entity_id=service_id,
        entity_label=item.title,
        old_value=old_data,
        request=request,
    )
    await db.commit()


@router.post("/{service_id}/toggle-visibility", response_model=ServiceItemOut)
async def toggle_visibility(
    service_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(ServiceItem).where(ServiceItem.id == service_id, ServiceItem.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Service item not found")

    old_val = {"is_visible": item.is_visible}
    item.is_visible = not item.is_visible
    new_val = {"is_visible": item.is_visible}

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="toggle_service_visibility",
        entity_type="service",
        entity_id=service_id,
        entity_label=item.title,
        old_value=old_val,
        new_value=new_val,
        request=request,
    )
    await db.commit()
    return item


@router.post("/reorder")
async def reorder_services(
    orders: Dict[int, int],
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    for s_id, order in orders.items():
        await db.execute(update(ServiceItem).where(ServiceItem.id == s_id).values(display_order=order))

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="reorder_services",
        entity_type="service",
        notes=f"Reordered services: {str(orders)}",
        request=request,
    )
    await db.commit()
    return {"success": True}
