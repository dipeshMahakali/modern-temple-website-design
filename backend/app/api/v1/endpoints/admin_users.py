"""Admin User Management"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_super_admin, require_admin
from app.repositories.user import UserRepository
from app.schemas.schemas import UserOut, UserCreate, UserUpdate

router = APIRouter()


@router.get("", response_model=List[UserOut])
@router.get("/", response_model=List[UserOut])
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_admin),
):
    repo = UserRepository(db)
    users, _ = await repo.get_all(skip=skip, limit=limit)
    return users


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    body: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_super_admin),
):
    repo = UserRepository(db)
    existing = await repo.get_by_email(body.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    from app.models.user import UserRole
    role = UserRole(body.role) if body.role in [r.value for r in UserRole] else UserRole.viewer
    return await repo.create(body.email, body.full_name, body.password, role)


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_admin)):
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    body: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_super_admin),
):
    repo = UserRepository(db)
    if not await repo.get_by_id(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    return await repo.update(user_id, **body.model_dump(exclude_none=True))


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_super_admin),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
    repo = UserRepository(db)
    if not await repo.get_by_id(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    await repo.deactivate(user_id)


@router.post("/{user_id}/unlock")
async def unlock_user(user_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_admin)):
    repo = UserRepository(db)
    await repo.unlock_user(user_id)
    return {"message": "User unlocked"}


@router.get("/{user_id}/login-history")
async def get_user_login_history(user_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_admin)):
    repo = UserRepository(db)
    return await repo.get_login_history(user_id, limit=50)
