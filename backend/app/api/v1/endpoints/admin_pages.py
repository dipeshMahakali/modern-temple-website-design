"""Admin Pages CRUD"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_editor, require_admin
from app.repositories.content import PageRepository
from app.schemas.schemas import PageOut, PageCreate, PageUpdate

router = APIRouter()


@router.get("", response_model=List[PageOut])
@router.get("/", response_model=List[PageOut])
async def list_pages(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = PageRepository(db)
    pages, total = await repo.get_all(skip=skip, limit=limit)
    return pages


@router.post("", response_model=PageOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=PageOut, status_code=status.HTTP_201_CREATED)
async def create_page(
    body: PageCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_admin),
):
    repo = PageRepository(db)
    existing = await repo.get_by_slug(body.slug)
    if existing:
        raise HTTPException(status_code=400, detail=f"Page with slug '{body.slug}' already exists")
    return await repo.create(**body.model_dump())


@router.get("/{page_id}", response_model=PageOut)
async def get_page(
    page_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = PageRepository(db)
    page = await repo.get_by_id(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.patch("/{page_id}", response_model=PageOut)
async def update_page(
    page_id: int,
    body: PageUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = PageRepository(db)
    page = await repo.get_by_id(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    updated = await repo.update(page_id, **body.model_dump(exclude_none=True))
    return updated


@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_page(
    page_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_admin),
):
    repo = PageRepository(db)
    page = await repo.get_by_id(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    await repo.delete(page_id)


@router.post("/{page_id}/publish")
async def publish_page(page_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = PageRepository(db)
    return await repo.update(page_id, status="published", is_enabled=True)


@router.post("/{page_id}/draft")
async def draft_page(page_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = PageRepository(db)
    return await repo.update(page_id, status="draft")


@router.post("/{page_id}/archive")
async def archive_page(page_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = PageRepository(db)
    return await repo.update(page_id, status="archived", is_enabled=False)


@router.post("/{page_id}/toggle-enabled")
async def toggle_page_enabled(page_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = PageRepository(db)
    page = await repo.get_by_id(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return await repo.update(page_id, is_enabled=not page.is_enabled)
