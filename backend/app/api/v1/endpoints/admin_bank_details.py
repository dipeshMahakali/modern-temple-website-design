"""Admin Bank Details CRUD"""
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log
from app.models.content import BankDetail
from app.schemas.schemas import BankDetailOut, BankDetailCreate, BankDetailUpdate

router = APIRouter()


@router.get("/", response_model=List[BankDetailOut])
async def list_bank_details(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(BankDetail).where(BankDetail.deleted_at == None).order_by(BankDetail.display_order.asc()))
    return list(result.scalars().all())


@router.post("/", response_model=BankDetailOut, status_code=status.HTTP_201_CREATED)
async def create_bank_detail(
    body: BankDetailCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    item = BankDetail(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="create_bank_detail",
        entity_type="bank_detail",
        entity_id=item.id,
        entity_label=item.label,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.patch("/{bank_id}", response_model=BankDetailOut)
async def update_bank_detail(
    bank_id: int,
    body: BankDetailUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(BankDetail).where(BankDetail.id == bank_id, BankDetail.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Bank detail not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}

    for k, v in body.model_dump(exclude_none=True).items():
        setattr(item, k, v)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_bank_detail",
        entity_type="bank_detail",
        entity_id=bank_id,
        entity_label=item.label,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.delete("/{bank_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bank_detail(
    bank_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(BankDetail).where(BankDetail.id == bank_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Bank detail not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await db.execute(delete(BankDetail).where(BankDetail.id == bank_id))
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="delete_bank_detail",
        entity_type="bank_detail",
        entity_id=bank_id,
        entity_label=item.label,
        old_value=old_data,
        request=request,
    )
    await db.commit()


@router.post("/{bank_id}/toggle-visibility", response_model=BankDetailOut)
async def toggle_visibility(
    bank_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(BankDetail).where(BankDetail.id == bank_id, BankDetail.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Bank detail not found")

    old_val = {"is_visible": item.is_visible}
    item.is_visible = not item.is_visible
    new_val = {"is_visible": item.is_visible}

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="toggle_bank_detail_visibility",
        entity_type="bank_detail",
        entity_id=bank_id,
        entity_label=item.label,
        old_value=old_val,
        new_value=new_val,
        request=request,
    )
    await db.commit()
    return item


@router.post("/reorder")
async def reorder_bank_details(
    orders: Dict[int, int],
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    for b_id, order in orders.items():
        await db.execute(update(BankDetail).where(BankDetail.id == b_id).values(display_order=order))

    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="reorder_bank_details",
        entity_type="bank_detail",
        notes=f"Reordered bank details: {str(orders)}",
        request=request,
    )
    await db.commit()
    return {"success": True}
