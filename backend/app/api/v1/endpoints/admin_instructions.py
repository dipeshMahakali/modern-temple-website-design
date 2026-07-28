"""Admin Instructions & Rules CRUD"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.audit import record_audit_log
from app.models.content import InstructionRule, InstructionDetail
from app.schemas.schemas import (
    InstructionRuleOut, InstructionRuleCreate, InstructionRuleUpdate,
    InstructionDetailOut, InstructionDetailCreate, InstructionDetailUpdate
)

router = APIRouter()

# ─── Instruction Rules ────────────────────────────────────────────────────────

@router.get("/rules", response_model=List[InstructionRuleOut])
async def list_rules(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(InstructionRule).where(InstructionRule.deleted_at == None).order_by(InstructionRule.display_order.asc()))
    return list(result.scalars().all())


@router.post("/rules", response_model=InstructionRuleOut, status_code=status.HTTP_201_CREATED)
async def create_rule(
    body: InstructionRuleCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    item = InstructionRule(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="create_instruction_rule",
        entity_type="instruction_rule",
        entity_id=item.id,
        entity_label=item.title,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.patch("/rules/{rule_id}", response_model=InstructionRuleOut)
async def update_rule(
    rule_id: int,
    body: InstructionRuleUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(InstructionRule).where(InstructionRule.id == rule_id, InstructionRule.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Instruction rule not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}

    for k, v in body.model_dump(exclude_none=True).items():
        setattr(item, k, v)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_instruction_rule",
        entity_type="instruction_rule",
        entity_id=rule_id,
        entity_label=item.title,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.delete("/rules/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rule(
    rule_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(InstructionRule).where(InstructionRule.id == rule_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Instruction rule not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await db.execute(delete(InstructionRule).where(InstructionRule.id == rule_id))
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="delete_instruction_rule",
        entity_type="instruction_rule",
        entity_id=rule_id,
        entity_label=item.title,
        old_value=old_data,
        request=request,
    )
    await db.commit()


# ─── Instruction Details ──────────────────────────────────────────────────────

@router.get("/details", response_model=List[InstructionDetailOut])
async def list_details(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(InstructionDetail).where(InstructionDetail.deleted_at == None).order_by(InstructionDetail.display_order.asc()))
    return list(result.scalars().all())


@router.post("/details", response_model=InstructionDetailOut, status_code=status.HTTP_201_CREATED)
async def create_detail(
    body: InstructionDetailCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    item = InstructionDetail(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="create_instruction_detail",
        entity_type="instruction_detail",
        entity_id=item.id,
        entity_label=item.title,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.patch("/details/{detail_id}", response_model=InstructionDetailOut)
async def update_detail(
    detail_id: int,
    body: InstructionDetailUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(InstructionDetail).where(InstructionDetail.id == detail_id, InstructionDetail.deleted_at == None))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Instruction detail not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}

    for k, v in body.model_dump(exclude_none=True).items():
        setattr(item, k, v)
    await db.commit()
    await db.refresh(item)

    new_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="update_instruction_detail",
        entity_type="instruction_detail",
        entity_id=detail_id,
        entity_label=item.title,
        old_value=old_data,
        new_value=new_data,
        request=request,
    )
    await db.commit()
    return item


@router.delete("/details/{detail_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_detail(
    detail_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    result = await db.execute(select(InstructionDetail).where(InstructionDetail.id == detail_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Instruction detail not found")

    old_data = {c.name: getattr(item, c.name) for c in item.__table__.columns if c.name not in ["created_at", "updated_at"]}
    await db.execute(delete(InstructionDetail).where(InstructionDetail.id == detail_id))
    await record_audit_log(
        db=db,
        user_id=current_user.id,
        action="delete_instruction_detail",
        entity_type="instruction_detail",
        entity_id=detail_id,
        entity_label=item.title,
        old_value=old_data,
        request=request,
    )
    await db.commit()
