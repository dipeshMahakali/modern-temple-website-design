"""Admin Media Library"""
import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.deps import require_editor
from app.core.config import settings
from app.models.media import MediaFile

router = APIRouter()

ALLOWED_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "application/pdf",
}


@router.get("/")
async def list_media(
    folder: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    query = select(MediaFile)
    if folder:
        query = query.where(MediaFile.folder == folder)
    query = query.order_by(MediaFile.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    folder: str = Form("general"),
    alt_text: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_editor),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"File type not allowed: {file.content_type}")

    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    contents = await file.read()
    if len(contents) > max_bytes:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB}MB")

    ext = file.filename.split(".")[-1].lower() if file.filename else "bin"
    filename = f"{uuid.uuid4().hex}.{ext}"

    upload_dir = settings.UPLOAD_DIR
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        upload_dir = "/tmp/uploads"

    upload_folder = os.path.join(upload_dir, folder)
    try:
        os.makedirs(upload_folder, exist_ok=True)
    except Exception:
        upload_folder = os.path.join("/tmp/uploads", folder)
        os.makedirs(upload_folder, exist_ok=True)

    filepath = os.path.join(upload_folder, filename)
    with open(filepath, "wb") as f:
        f.write(contents)

    url = f"/uploads/{folder}/{filename}"

    media = MediaFile(
        filename=filename,
        original_filename=file.filename,
        url=url,
        mimetype=file.content_type,
        size_bytes=len(contents),
        folder=folder,
        alt_text=alt_text,
        uploaded_by=current_user.id,
    )
    db.add(media)
    await db.commit()
    await db.refresh(media)
    return media


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(media_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_editor)):
    result = await db.execute(select(MediaFile).where(MediaFile.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media file not found")

    # Delete physical file
    if media.url and media.url.startswith("/uploads/"):
        rel_path = media.url.replace("/uploads/", "")
        for base in ["/tmp/uploads", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")]:
            filepath = os.path.join(base, rel_path)
            if os.path.exists(filepath):
                try:
                    os.remove(filepath)
                except Exception:
                    pass

    await db.delete(media)
    await db.commit()
