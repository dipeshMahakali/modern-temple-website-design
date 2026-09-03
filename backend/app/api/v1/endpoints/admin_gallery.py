"""Admin Gallery — CRUD + File Upload"""
import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.config import settings
from app.repositories.content import GalleryRepository
from app.schemas.schemas import GalleryItemOut, GalleryItemCreate, GalleryItemUpdate

router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@router.get("", response_model=List[GalleryItemOut])
@router.get("/", response_model=List[GalleryItemOut])
async def list_gallery(
    category: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = GalleryRepository(db)
    items, total = await repo.get_all(category=category, skip=skip, limit=limit)
    return items


@router.post("/upload", response_model=GalleryItemOut, status_code=status.HTTP_201_CREATED)
async def upload_gallery_image(
    file: UploadFile = File(...),
    category: str = Form("general"),
    alt_text: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"File type not allowed: {file.content_type}")

    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    contents = await file.read()
    if len(contents) > max_bytes:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB}MB")

    # Save file
    ext = file.filename.split(".")[-1].lower() if file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"

    upload_dir = settings.UPLOAD_DIR
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        upload_dir = "/tmp/uploads"

    folder = os.path.join(upload_dir, "gallery")
    try:
        os.makedirs(folder, exist_ok=True)
    except Exception:
        folder = os.path.join("/tmp/uploads", "gallery")
        os.makedirs(folder, exist_ok=True)

    filepath = os.path.join(folder, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    url = f"/uploads/gallery/{filename}"

    repo = GalleryRepository(db)
    return await repo.create(
        category=category,
        url=url,
        alt_text=alt_text,
        is_featured=is_featured,
    )


@router.patch("/{item_id}", response_model=GalleryItemOut)
async def update_gallery_item(
    item_id: int,
    body: GalleryItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = GalleryRepository(db)
    item = await repo.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return await repo.update(item_id, **body.model_dump(exclude_none=True))


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gallery_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    repo = GalleryRepository(db)
    item = await repo.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    # Try to delete file
    if item.url and item.url.startswith("/uploads/"):
        rel_path = item.url.replace("/uploads/", "")
        for base in ["/tmp/uploads", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")]:
            filepath = os.path.join(base, rel_path)
            if os.path.exists(filepath):
                try:
                    os.remove(filepath)
                except Exception:
                    pass
    await repo.delete(item_id)


@router.post("/{item_id}/toggle-visibility")
async def toggle_visibility(item_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    repo = GalleryRepository(db)
    item = await repo.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return await repo.update(item_id, is_visible=not item.is_visible)
