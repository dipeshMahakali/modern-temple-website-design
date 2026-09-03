"""Admin Timeline CRUD"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_editor
from app.repositories.content import TimelineRepository
from app.schemas.schemas import TimelineEntryOut, TimelineEntryCreate, TimelineEntryUpdate

router = APIRouter()


@router.get("", response_model=List[TimelineEntryOut])
@router.get("/", response_model=List[TimelineEntryOut])
async def list_entries(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = TimelineRepository(db)
    return await repo.get_all()


@router.post("", response_model=TimelineEntryOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=TimelineEntryOut, status_code=status.HTTP_201_CREATED)
async def create_entry(body: TimelineEntryCreate, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = TimelineRepository(db)
    return await repo.create(**body.model_dump())


@router.get("/{entry_id}", response_model=TimelineEntryOut)
async def get_entry(entry_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = TimelineRepository(db)
    entry = await repo.get_by_id(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Timeline entry not found")
    return entry


@router.patch("/{entry_id}", response_model=TimelineEntryOut)
async def update_entry(entry_id: int, body: TimelineEntryUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = TimelineRepository(db)
    entry = await repo.get_by_id(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Timeline entry not found")
    return await repo.update(entry_id, **body.model_dump(exclude_none=True))


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(entry_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = TimelineRepository(db)
    if not await repo.get_by_id(entry_id):
        raise HTTPException(status_code=404, detail="Timeline entry not found")
    await repo.delete(entry_id)


@router.post("/{entry_id}/toggle-visibility")
async def toggle_visibility(entry_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = TimelineRepository(db)
    entry = await repo.get_by_id(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Timeline entry not found")
    return await repo.update(entry_id, is_visible=not entry.is_visible)
