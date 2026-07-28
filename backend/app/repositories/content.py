"""
Content Repository — CRUD for all CMS content models
"""
from typing import Optional, List, Tuple
from sqlalchemy import select, update, delete, func, and_, asc, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.content import (
    Page, Section, NavigationItem, TimelineEntry,
    GalleryItem, Event, HeroConfig, TempleInfo,
    TempleTiming, SeoEntry, ContactMessage, PageStatus
)


class PageRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, skip=0, limit=50, include_disabled=True) -> Tuple[List[Page], int]:
        query = select(Page)
        if not include_disabled:
            query = query.where(and_(Page.is_enabled == True, Page.status == PageStatus.published))
        query = query.order_by(Page.display_order.asc())
        count = await self.db.execute(select(func.count()).select_from(query.subquery()))
        result = await self.db.execute(query.offset(skip).limit(limit))
        return result.scalars().all(), count.scalar_one()

    async def get_by_slug(self, slug: str, enabled_only=False) -> Optional[Page]:
        query = select(Page).where(Page.slug == slug)
        if enabled_only:
            query = query.where(and_(Page.is_enabled == True, Page.status == PageStatus.published))
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_id(self, page_id: int) -> Optional[Page]:
        result = await self.db.execute(select(Page).where(Page.id == page_id))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> Page:
        page = Page(**kwargs)
        self.db.add(page)
        await self.db.commit()
        await self.db.refresh(page)
        return page

    async def update(self, page_id: int, **kwargs) -> Optional[Page]:
        await self.db.execute(update(Page).where(Page.id == page_id).values(**kwargs))
        await self.db.commit()
        return await self.get_by_id(page_id)

    async def delete(self, page_id: int) -> None:
        await self.db.execute(delete(Page).where(Page.id == page_id))
        await self.db.commit()


class SectionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, visible_only=False) -> List[Section]:
        query = select(Section)
        if visible_only:
            query = query.where(Section.is_visible == True)
        result = await self.db.execute(query.order_by(Section.display_order.asc()))
        return result.scalars().all()

    async def get_by_slug(self, slug: str) -> Optional[Section]:
        result = await self.db.execute(select(Section).where(Section.slug == slug))
        return result.scalar_one_or_none()

    async def get_by_id(self, section_id: int) -> Optional[Section]:
        result = await self.db.execute(select(Section).where(Section.id == section_id))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> Section:
        section = Section(**kwargs)
        self.db.add(section)
        await self.db.commit()
        await self.db.refresh(section)
        return section

    async def update(self, section_id: int, **kwargs) -> Optional[Section]:
        await self.db.execute(update(Section).where(Section.id == section_id).values(**kwargs))
        await self.db.commit()
        return await self.get_by_id(section_id)

    async def delete(self, section_id: int) -> None:
        await self.db.execute(delete(Section).where(Section.id == section_id))
        await self.db.commit()


class TimelineRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, visible_only=False) -> List[TimelineEntry]:
        query = select(TimelineEntry)
        if visible_only:
            query = query.where(TimelineEntry.is_visible == True)
        result = await self.db.execute(query.order_by(TimelineEntry.display_order.asc()))
        return result.scalars().all()

    async def get_by_id(self, entry_id: int) -> Optional[TimelineEntry]:
        result = await self.db.execute(select(TimelineEntry).where(TimelineEntry.id == entry_id))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> TimelineEntry:
        entry = TimelineEntry(**kwargs)
        self.db.add(entry)
        await self.db.commit()
        await self.db.refresh(entry)
        return entry

    async def update(self, entry_id: int, **kwargs) -> Optional[TimelineEntry]:
        await self.db.execute(update(TimelineEntry).where(TimelineEntry.id == entry_id).values(**kwargs))
        await self.db.commit()
        return await self.get_by_id(entry_id)

    async def delete(self, entry_id: int) -> None:
        await self.db.execute(delete(TimelineEntry).where(TimelineEntry.id == entry_id))
        await self.db.commit()


class GalleryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, category=None, visible_only=False, skip=0, limit=100) -> Tuple[List[GalleryItem], int]:
        query = select(GalleryItem)
        if visible_only:
            query = query.where(GalleryItem.is_visible == True)
        if category:
            query = query.where(GalleryItem.category == category)
        count_result = await self.db.execute(select(func.count()).select_from(query.subquery()))
        total = count_result.scalar_one()
        result = await self.db.execute(query.order_by(GalleryItem.sort_order.asc()).offset(skip).limit(limit))
        return result.scalars().all(), total

    async def get_by_id(self, item_id: int) -> Optional[GalleryItem]:
        result = await self.db.execute(select(GalleryItem).where(GalleryItem.id == item_id))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> GalleryItem:
        item = GalleryItem(**kwargs)
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def update(self, item_id: int, **kwargs) -> Optional[GalleryItem]:
        await self.db.execute(update(GalleryItem).where(GalleryItem.id == item_id).values(**kwargs))
        await self.db.commit()
        return await self.get_by_id(item_id)

    async def delete(self, item_id: int) -> None:
        await self.db.execute(delete(GalleryItem).where(GalleryItem.id == item_id))
        await self.db.commit()


class EventRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, visible_only=False, skip=0, limit=50) -> Tuple[List[Event], int]:
        query = select(Event)
        if visible_only:
            query = query.where(Event.is_visible == True)
        count_result = await self.db.execute(select(func.count()).select_from(query.subquery()))
        total = count_result.scalar_one()
        result = await self.db.execute(query.order_by(Event.event_date.desc()).offset(skip).limit(limit))
        return result.scalars().all(), total

    async def get_by_id(self, event_id: int) -> Optional[Event]:
        result = await self.db.execute(select(Event).where(Event.id == event_id))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> Event:
        event = Event(**kwargs)
        self.db.add(event)
        await self.db.commit()
        await self.db.refresh(event)
        return event

    async def update(self, event_id: int, **kwargs) -> Optional[Event]:
        await self.db.execute(update(Event).where(Event.id == event_id).values(**kwargs))
        await self.db.commit()
        return await self.get_by_id(event_id)

    async def delete(self, event_id: int) -> None:
        await self.db.execute(delete(Event).where(Event.id == event_id))
        await self.db.commit()


class NavigationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, visible_only=False, location=None) -> List[NavigationItem]:
        query = select(NavigationItem)
        if visible_only:
            query = query.where(NavigationItem.is_visible == True)
        if location:
            query = query.where(NavigationItem.location.in_([location, "both"]))
        result = await self.db.execute(query.order_by(NavigationItem.display_order.asc()))
        return result.scalars().all()

    async def get_by_id(self, nav_id: int) -> Optional[NavigationItem]:
        result = await self.db.execute(select(NavigationItem).where(NavigationItem.id == nav_id))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> NavigationItem:
        item = NavigationItem(**kwargs)
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def update(self, nav_id: int, **kwargs) -> Optional[NavigationItem]:
        await self.db.execute(update(NavigationItem).where(NavigationItem.id == nav_id).values(**kwargs))
        await self.db.commit()
        return await self.get_by_id(nav_id)

    async def delete(self, nav_id: int) -> None:
        await self.db.execute(delete(NavigationItem).where(NavigationItem.id == nav_id))
        await self.db.commit()


class TempleInfoRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, group=None) -> List[TempleInfo]:
        query = select(TempleInfo)
        if group:
            query = query.where(TempleInfo.group == group)
        result = await self.db.execute(query.order_by(TempleInfo.display_order.asc()))
        return result.scalars().all()

    async def get_by_key(self, key: str) -> Optional[TempleInfo]:
        result = await self.db.execute(select(TempleInfo).where(TempleInfo.key == key))
        return result.scalar_one_or_none()

    async def upsert(self, key: str, value: str, group: str = "general", label: str = None) -> TempleInfo:
        existing = await self.get_by_key(key)
        if existing:
            existing.value = value
            if label:
                existing.label = label
            await self.db.commit()
            await self.db.refresh(existing)
            return existing
        item = TempleInfo(key=key, value=value, group=group, label=label)
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def delete(self, info_id: int) -> None:
        await self.db.execute(delete(TempleInfo).where(TempleInfo.id == info_id))
        await self.db.commit()


class SeoRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_slug(self, slug: str) -> Optional[SeoEntry]:
        result = await self.db.execute(select(SeoEntry).where(SeoEntry.page_slug == slug))
        return result.scalar_one_or_none()

    async def upsert(self, slug: str, **kwargs) -> SeoEntry:
        existing = await self.get_by_slug(slug)
        if existing:
            for k, v in kwargs.items():
                setattr(existing, k, v)
            await self.db.commit()
            await self.db.refresh(existing)
            return existing
        entry = SeoEntry(page_slug=slug, **kwargs)
        self.db.add(entry)
        await self.db.commit()
        await self.db.refresh(entry)
        return entry

    async def get_all(self) -> List[SeoEntry]:
        result = await self.db.execute(select(SeoEntry).order_by(SeoEntry.page_slug))
        return result.scalars().all()


class ContactRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, **kwargs) -> ContactMessage:
        msg = ContactMessage(**kwargs)
        self.db.add(msg)
        await self.db.commit()
        await self.db.refresh(msg)
        return msg

    async def get_all(self, unread_only=False, skip=0, limit=50) -> Tuple[List[ContactMessage], int]:
        query = select(ContactMessage)
        if unread_only:
            query = query.where(ContactMessage.is_read == False)
        count_result = await self.db.execute(select(func.count()).select_from(query.subquery()))
        total = count_result.scalar_one()
        result = await self.db.execute(query.order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit))
        return result.scalars().all(), total

    async def mark_read(self, msg_id: int) -> None:
        await self.db.execute(update(ContactMessage).where(ContactMessage.id == msg_id).values(is_read=True))
        await self.db.commit()
