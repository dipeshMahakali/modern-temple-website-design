"""
Audit and Revision Logging Helper
"""
from typing import Optional, Any, Dict
from fastapi import Request
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog
from app.models.content import ContentRevision


async def record_audit_log(
    db: AsyncSession,
    user_id: int,
    action: str,
    entity_type: Optional[str] = None,
    entity_id: Optional[int] = None,
    entity_label: Optional[str] = None,
    old_value: Optional[Dict[str, Any]] = None,
    new_value: Optional[Dict[str, Any]] = None,
    request: Optional[Request] = None,
    notes: Optional[str] = None,
):
    ip_address = None
    user_agent = None
    if request:
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

    log = AuditLog(
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        entity_label=entity_label,
        old_value=old_value,
        new_value=new_value,
        ip_address=ip_address,
        user_agent=user_agent,
        notes=notes,
    )
    db.add(log)
    await db.flush()
    return log


async def record_revision(
    db: AsyncSession,
    entity_type: str,
    entity_id: int,
    data: Dict[str, Any],
    user_id: int,
    comment: Optional[str] = None,
):
    # Find current max version
    query = select(func.max(ContentRevision.version)).where(
        ContentRevision.entity_type == entity_type,
        ContentRevision.entity_id == entity_id
    )
    result = await db.execute(query)
    current_version = result.scalar() or 0
    new_version = current_version + 1

    revision = ContentRevision(
        entity_type=entity_type,
        entity_id=entity_id,
        version=new_version,
        data=data,
        created_by_id=user_id,
        comment=comment,
    )
    db.add(revision)
    await db.flush()
    return revision
