"""Admin Navigation CRUD"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_editor
from app.repositories.content import NavigationRepository
from app.schemas.schemas import NavigationItemOut, NavigationItemCreate, NavigationItemUpdate

router = APIRouter()


@router.get("", response_model=List[NavigationItemOut])
@router.get("/", response_model=List[NavigationItemOut])
async def list_nav(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = NavigationRepository(db)
    return await repo.get_all()


@router.post("", response_model=NavigationItemOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=NavigationItemOut, status_code=status.HTTP_201_CREATED)
async def create_nav_item(body: NavigationItemCreate, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = NavigationRepository(db)
    return await repo.create(**body.model_dump())


@router.patch("/{nav_id}", response_model=NavigationItemOut)
async def update_nav_item(nav_id: int, body: NavigationItemUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = NavigationRepository(db)
    if not await repo.get_by_id(nav_id):
        raise HTTPException(status_code=404, detail="Navigation item not found")
    return await repo.update(nav_id, **body.model_dump(exclude_none=True))


@router.delete("/{nav_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_nav_item(nav_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = NavigationRepository(db)
    if not await repo.get_by_id(nav_id):
        raise HTTPException(status_code=404, detail="Navigation item not found")
    await repo.delete(nav_id)


@router.post("/{nav_id}/toggle-visibility")
async def toggle_nav_visibility(nav_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = NavigationRepository(db)
    item = await repo.get_by_id(nav_id)
    if not item:
        raise HTTPException(status_code=404, detail="Navigation item not found")
    return await repo.update(nav_id, is_visible=not item.is_visible)
