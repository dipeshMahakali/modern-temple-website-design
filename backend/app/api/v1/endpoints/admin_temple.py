"""Admin Temple Info & Timings"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_editor
from app.repositories.content import TempleInfoRepository
from app.schemas.schemas import TempleInfoOut, TempleInfoUpsert

router = APIRouter()


@router.get("/info", response_model=List[TempleInfoOut])
async def list_info(db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = TempleInfoRepository(db)
    return await repo.get_all()


@router.put("/info", response_model=TempleInfoOut)
async def upsert_info(body: TempleInfoUpsert, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = TempleInfoRepository(db)
    return await repo.upsert(body.key, body.value, body.group, body.label)


@router.put("/info/bulk")
async def bulk_upsert_info(
    items: List[TempleInfoUpsert],
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = TempleInfoRepository(db)
    results = []
    for item in items:
        r = await repo.upsert(item.key, item.value, item.group, item.label)
        results.append(r)
    return results
