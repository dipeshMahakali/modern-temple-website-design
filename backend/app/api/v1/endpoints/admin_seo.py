"""Admin SEO Management"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_editor
from app.repositories.content import SeoRepository
from app.schemas.schemas import SeoEntryOut, SeoEntryUpsert

router = APIRouter()


@router.get("", response_model=List[SeoEntryOut])
@router.get("/", response_model=List[SeoEntryOut])
async def list_seo(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = SeoRepository(db)
    return await repo.get_all()


@router.get("/{slug}", response_model=SeoEntryOut)
async def get_seo(slug: str, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = SeoRepository(db)
    entry = await repo.get_by_slug(slug)
    if not entry:
        raise HTTPException(status_code=404, detail="SEO entry not found")
    return entry


@router.put("/{slug}", response_model=SeoEntryOut)
async def upsert_seo(slug: str, body: SeoEntryUpsert, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = SeoRepository(db)
    return await repo.upsert(slug, **body.model_dump(exclude_none=True))
