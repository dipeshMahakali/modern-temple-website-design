"""Admin Contact Messages"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_editor
from app.repositories.content import ContactRepository
from app.schemas.schemas import ContactMessageOut

router = APIRouter()


@router.get("/messages", response_model=List[ContactMessageOut])
async def list_messages(
    unread_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = ContactRepository(db)
    messages, _ = await repo.get_all(unread_only=unread_only, skip=skip, limit=limit)
    return messages


@router.post("/messages/{msg_id}/read")
async def mark_as_read(msg_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = ContactRepository(db)
    await repo.mark_read(msg_id)
    return {"message": "Marked as read"}


@router.post("/messages/submit")
async def submit_contact(
    body: dict,
    db: AsyncSession = Depends(get_db),
):
    """Public: submit a contact message"""
    from app.schemas.schemas import ContactMessageCreate
    from pydantic import ValidationError
    try:
        data = ContactMessageCreate(**body)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    repo = ContactRepository(db)
    msg = await repo.create(**data.model_dump())
    return {"success": True, "id": msg.id}
