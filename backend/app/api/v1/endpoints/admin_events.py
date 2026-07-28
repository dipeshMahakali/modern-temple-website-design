"""Admin Events CRUD"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_editor
from app.repositories.content import EventRepository
from app.schemas.schemas import EventOut, EventCreate, EventUpdate

router = APIRouter()


@router.get("/", response_model=List[EventOut])
async def list_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = EventRepository(db)
    events, _ = await repo.get_all(skip=skip, limit=limit)
    return events


@router.post("/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
async def create_event(body: EventCreate, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = EventRepository(db)
    return await repo.create(**body.model_dump())


@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = EventRepository(db)
    event = await repo.get_by_id(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.patch("/{event_id}", response_model=EventOut)
async def update_event(event_id: int, body: EventUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = EventRepository(db)
    if not await repo.get_by_id(event_id):
        raise HTTPException(status_code=404, detail="Event not found")
    return await repo.update(event_id, **body.model_dump(exclude_none=True))


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    if not await EventRepository(db).get_by_id(event_id):
        raise HTTPException(status_code=404, detail="Event not found")
    await EventRepository(db).delete(event_id)


@router.post("/{event_id}/toggle-visibility")
async def toggle_visibility(event_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = EventRepository(db)
    event = await repo.get_by_id(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return await repo.update(event_id, is_visible=not event.is_visible)
