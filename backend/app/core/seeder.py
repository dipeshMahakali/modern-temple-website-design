"""
Database Seeder — creates initial data on startup
- Super admin user
- Default pages, sections, navigation
- Default temple info
- Sample timeline entries
"""
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.core.config import settings

logger = logging.getLogger(__name__)


async def seed_initial_data():
    """Run all seeds"""
    async with AsyncSessionLocal() as db:
        await _seed_super_admin(db)
        await _seed_pages(db)
        await _seed_sections(db)
        await _seed_navigation(db)
        await _seed_temple_info(db)
        await _seed_timeline(db)
        await _seed_seo(db)


async def _seed_super_admin(db: AsyncSession):
    from app.models.user import User, UserRole
    from app.repositories.user import UserRepository
    result = await db.execute(select(User).where(User.email == settings.SUPER_ADMIN_EMAIL))
    if result.scalar_one_or_none():
        return
    repo = UserRepository(db)
    user = await repo.create(
        email=settings.SUPER_ADMIN_EMAIL,
        full_name=settings.SUPER_ADMIN_NAME,
        password=settings.SUPER_ADMIN_PASSWORD,
        role=UserRole.super_admin,
    )
    logger.info(f"✅ Super admin created: {user.email}")


async def _seed_pages(db: AsyncSession):
    from app.models.content import Page
    result = await db.execute(select(Page))
    if result.scalars().first():
        return
    pages = [
        {"slug": "home", "title": "Home", "display_order": 0},
        {"slug": "about", "title": "About", "display_order": 1},
        {"slug": "history", "title": "History", "display_order": 2},
        {"slug": "darshan", "title": "Live Darshan", "display_order": 3},
        {"slug": "events", "title": "Events", "display_order": 4},
        {"slug": "gallery", "title": "Gallery", "display_order": 5},
        {"slug": "trust", "title": "Trust", "display_order": 6},
        {"slug": "donate", "title": "Donate", "display_order": 7},
        {"slug": "instructions", "title": "Instructions", "display_order": 8},
        {"slug": "contact", "title": "Contact", "display_order": 9},
        {"slug": "privacy", "title": "Privacy Policy", "display_order": 10, "show_in_navbar": False},
        {"slug": "terms", "title": "Terms of Service", "display_order": 11, "show_in_navbar": False},
    ]
    for p in pages:
        page = Page(**p)
        db.add(page)
    await db.commit()
    logger.info("✅ Default pages seeded")


async def _seed_sections(db: AsyncSession):
    from app.models.content import Section
    result = await db.execute(select(Section))
    if result.scalars().first():
        return
    sections = [
        {"slug": "hero", "title": "Hero Banner", "display_order": 0},
        {"slug": "stats", "title": "Stats", "display_order": 1},
        {"slug": "about", "title": "About", "display_order": 2},
        {"slug": "timings", "title": "Temple Timings", "display_order": 3},
        {"slug": "live-darshan", "title": "Live Darshan", "display_order": 4},
        {"slug": "services", "title": "Services", "display_order": 5},
        {"slug": "timeline", "title": "Timeline", "display_order": 6},
        {"slug": "trustees", "title": "Trustees", "display_order": 7},
        {"slug": "testimonials", "title": "Testimonials", "display_order": 8},
        {"slug": "contact", "title": "Contact", "display_order": 9},
        {"slug": "gallery", "title": "Gallery", "display_order": 10},
        {"slug": "events", "title": "Events", "display_order": 11},
    ]
    for s in sections:
        section = Section(**s)
        db.add(section)
    await db.commit()
    logger.info("✅ Default sections seeded")


async def _seed_navigation(db: AsyncSession):
    from app.models.content import NavigationItem
    result = await db.execute(select(NavigationItem))
    if result.scalars().first():
        return
    nav_items = [
        {"label": "Home", "slug": "home", "display_order": 0, "location": "main"},
        {"label": "About", "slug": "about", "display_order": 1, "location": "main"},
        {"label": "History", "slug": "history", "display_order": 2, "location": "main"},
        {"label": "Live Darshan", "slug": "darshan", "display_order": 3, "location": "main"},
        {"label": "Events", "slug": "events", "display_order": 4, "location": "both"},
        {"label": "Gallery", "slug": "gallery", "display_order": 5, "location": "both"},
        {"label": "Trust", "slug": "trust", "display_order": 6, "location": "main"},
        {"label": "Donate", "slug": "donate", "display_order": 7, "location": "both"},
        {"label": "Contact", "slug": "contact", "display_order": 8, "location": "both"},
    ]
    for item in nav_items:
        nav = NavigationItem(**item)
        db.add(nav)
    await db.commit()
    logger.info("✅ Default navigation seeded")


async def _seed_temple_info(db: AsyncSession):
    from app.models.content import TempleInfo
    result = await db.execute(select(TempleInfo))
    if result.scalars().first():
        return
    info = [
        {"key": "phone_primary", "value": "+91-2656-240-xxx", "group": "contact", "label": "Primary Phone"},
        {"key": "phone_emergency", "value": "+91-2656-240-xxx", "group": "contact", "label": "Emergency"},
        {"key": "email", "value": "info@pavagadhtemple.in", "group": "contact", "label": "Email"},
        {"key": "address_line1", "value": "Shri Mahakali Mataji Temple", "group": "address", "label": "Temple Name"},
        {"key": "address_line2", "value": "Pavagadh Hill, Panchmahal", "group": "address", "label": "Address"},
        {"key": "address_city", "value": "Halol, Gujarat 389350", "group": "address", "label": "City"},
        {"key": "google_maps_url", "value": "https://goo.gl/maps/example", "group": "maps", "label": "Google Maps"},
        {"key": "facebook_url", "value": "https://facebook.com/pavagadhtemple", "group": "social"},
        {"key": "instagram_url", "value": "https://instagram.com/pavagadhtemple", "group": "social"},
        {"key": "youtube_url", "value": "https://youtube.com/@pavagadhtemple", "group": "social"},
        {"key": "temple_name", "value": "Shri Mahakali Mataji Temple", "group": "general", "label": "Temple Name"},
        {"key": "temple_name_devanagari", "value": "श्री महाकाली माताजी मंदिर", "group": "general"},
        {"key": "established_year", "value": "Ancient — 10th Century CE", "group": "general"},
    ]
    for i in info:
        ti = TempleInfo(**i)
        db.add(ti)
    await db.commit()
    logger.info("✅ Temple info seeded")


async def _seed_timeline(db: AsyncSession):
    from app.models.content import TimelineEntry
    result = await db.execute(select(TimelineEntry))
    if result.scalars().first():
        return
    entries = [
        {
            "year": "7th Century", "period": "Ancient Era",
            "title": "The Sacred Hill of Pavagadh",
            "description": "Pavagadh, meaning 'hill of snakes' in Gujarati, has been a site of spiritual significance since antiquity. Ancient texts reference the hill as a powerful Shakti Peetha, one of the 51 sacred seats of the goddess.",
            "display_order": 0,
        },
        {
            "year": "10th–12th Century", "period": "Medieval Period",
            "title": "The Chapaneri Kingdom",
            "description": "The Chavda and later Solanki dynasties ruled the fertile plains surrounding Pavagadh. The hilltop fort became a strategic military stronghold, and the temple was patronized extensively.",
            "display_order": 1,
        },
        {
            "year": "1484 CE", "period": "Mughal Era",
            "title": "The Siege of Champaner",
            "description": "Mahmud Begada, the Sultan of Gujarat, laid siege to Pavagadh after a prolonged campaign. The Rajput ruler Patai Raval made a heroic last stand. The fort fell after 20 months of resistance.",
            "display_order": 2,
        },
        {
            "year": "15th–16th Century", "period": "Champaner-Pavagadh",
            "title": "UNESCO World Heritage Site",
            "description": "Champaner-Pavagadh Archaeological Park was declared a UNESCO World Heritage Site in 2004, recognizing its unique concentration of archaeological, historic, and living cultural heritage.",
            "display_order": 3,
        },
        {
            "year": "20th Century", "period": "Modern Era",
            "title": "Temple Restoration & Ropeway",
            "description": "Major restoration work was undertaken and a modern ropeway was constructed to allow pilgrims easy access to the temple on the hilltop, increasing annual visitors to over a million devotees.",
            "display_order": 4,
        },
    ]
    for e in entries:
        entry = TimelineEntry(**e)
        db.add(entry)
    await db.commit()
    logger.info("✅ Timeline entries seeded")


async def _seed_seo(db: AsyncSession):
    from app.models.content import SeoEntry
    result = await db.execute(select(SeoEntry))
    if result.scalars().first():
        return
    seo_entries = [
        {
            "page_slug": "home",
            "meta_title": "Shri Mahakali Mataji Temple, Pavagadh — Sacred Shakti Peetha",
            "meta_description": "Visit the divine Shri Mahakali Mataji Temple at Pavagadh, Gujarat — one of the 51 Shakti Peethas. Explore history, live darshan, timings, events, and more.",
            "keywords": "Pavagadh Temple, Mahakali Mataji, Shakti Peetha, Gujarat Temple, Champaner",
            "robots": "index, follow",
        },
        {
            "page_slug": "gallery",
            "meta_title": "Gallery — Shri Mahakali Mataji Temple Pavagadh",
            "meta_description": "Browse the sacred gallery of Shri Mahakali Mataji Temple at Pavagadh. View festival photos, temple architecture, and divine celebrations.",
        },
        {
            "page_slug": "events",
            "meta_title": "Upcoming Events — Shri Mahakali Mataji Temple Pavagadh",
            "meta_description": "Stay updated with festivals, pujas, and special events at Pavagadh temple.",
        },
    ]
    for s in seo_entries:
        seo = SeoEntry(**s)
        db.add(seo)
    await db.commit()
    logger.info("✅ SEO entries seeded")
