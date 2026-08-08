"""
Database Seeder — creates initial data on startup
- Super admin user
- Default pages, sections, navigation
- Default temple info
- Sample timeline entries
- Hero Config, Stats, Trustees, Testimonials, Instructions, Services, Bank Details, Timings
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
        await _seed_hero(db)
        await _seed_stats(db)
        await _seed_trustees(db)
        await _seed_testimonials(db)
        await _seed_instructions(db)
        await _seed_services(db)
        await _seed_bank_details(db)
        await _seed_timings(db)
        await _seed_forms(db)
        await _seed_gallery(db)
        await _seed_events(db)
        await _sanitize_legacy_bad_urls(db)


async def _sanitize_legacy_bad_urls(db: AsyncSession):
    from sqlalchemy import update
    from app.models.content import GalleryItem, Event

    # Clean any legacy nightclub, waistcoat photo, or South Indian gopuram URLs from SQLite DB
    await db.execute(
        update(GalleryItem)
        .where(
            GalleryItem.url.like("%1566737236500%") | 
            GalleryItem.url.like("%1545128485%") | 
            GalleryItem.url.like("%1582510003544%")
        )
        .values(
            url="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
            alt_text="Heritage Temple Shikhara",
            caption="Sacred temple spire and saffron flag crowning the holy shrine precinct of Maa Bamleshwari."
        )
    )
    await db.execute(
        update(Event)
        .where(Event.banner_url.like("%1545128485%") | Event.banner_url.like("%1566737236500%"))
        .values(banner_url="/assets/about-bg.png")
    )
    await db.commit()


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
        {"label": "About Temple", "slug": "about", "display_order": 1, "location": "main"},
        {"label": "Temple History", "slug": "history", "display_order": 2, "location": "main"},
        {"label": "Darshan", "slug": "darshan", "display_order": 3, "location": "main"},
        {"label": "Events", "slug": "events", "display_order": 4, "location": "both"},
        {"label": "Gallery", "slug": "gallery", "display_order": 5, "location": "both"},
        {"label": "Trust", "slug": "trust", "display_order": 6, "location": "main"},
        {"label": "Donate", "slug": "donate", "display_order": 7, "location": "main"},
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
        {"key": "phone_primary", "value": "+91 94252 04990", "group": "contact", "label": "Lower Temple Phone"},
        {"key": "phone_emergency", "value": "+91 94252 05899", "group": "contact", "label": "Upper Temple Phone"},
        {"key": "email", "value": "bmtsd72@gmail.com", "group": "contact", "label": "Email"},
        {"key": "address_line1", "value": "Shri Bamleshwari Mandir Trust Samiti", "group": "address", "label": "Temple Trust Office"},
        {"key": "address_line2", "value": "Chhirpani Parisar, Dongargarh", "group": "address", "label": "Address Line 2"},
        {"key": "address_city", "value": "Rajnandgaon, Chhattisgarh – 491445", "group": "address", "label": "City"},
        {"key": "google_maps_url", "value": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.4984241774845!2d80.74971847600863!3d21.179213982845624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a297e6855555555%3A0x6b7bb8d3b844ad3c!2sMaa%20Bamleshwari%20Temple!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin", "group": "maps", "label": "Google Maps Embed URL"},
        {"key": "facebook_url", "value": "https://facebook.com/bamleshwaritemple", "group": "social"},
        {"key": "instagram_url", "value": "https://instagram.com/bamleshwaritemple", "group": "social"},
        {"key": "youtube_url", "value": "https://youtube.com/@bamleshwaritemple", "group": "social"},
        {"key": "temple_name", "value": "Maa Bamleshwari Temple", "group": "general", "label": "Temple Name"},
        {"key": "temple_name_devanagari", "value": "जय माँ बम्लेश्वरी", "group": "general"},
        {"key": "established_year", "value": "Ancient — 2200 Years Ago", "group": "general"},
        {"key": "about_title_small", "value": "Divine Grace Since Time Immemorial", "group": "about"},
        {"key": "about_title_large", "value": "Maa Bamleshwari Temple", "group": "about"},
        {"key": "about_desc_1", "value": "Perched atop the majestic Dongargarh Hill, the temple of Badi Bamleshwari Devi is one of Chhattisgarh's most celebrated and ancient Shakti Peeths. The hill itself rises 1,600 feet, acting as a spiritual landmark visible from miles across the Rajnandgaon district.", "group": "about"},
        {"key": "about_desc_2", "value": "For generations, the temple has drawn millions of devotees from Chhattisgarh and all over India. Believed to have been established over 2,200 years ago by Raja Veersen, the shrine features Badi Bamleshwari at the summit and Chhoti Bamleshwari at the base, creating a beautiful and sacred pilgrimage experience.", "group": "about"},
        {"key": "about_trust_title", "value": "Shri Bamleshwari Mandir Trust Samiti", "group": "about"},
        {"key": "about_trust_desc", "value": "Preserving spiritual heritage & offering welfare services for devotees.", "group": "about"},
        {"key": "about_bg_image", "value": "/assets/about-bg.png", "group": "about"},
        {"key": "live_video_url", "value": "https://www.youtube.com/watch?v=wulPPdw-FUk", "group": "darshan", "label": "Main Live Stream Video URL"},
        {"key": "live_portal_subtitle", "value": "Darshan Portal", "group": "darshan", "label": "Portal Subtitle"},
        {"key": "live_portal_title", "value": "Watch Live Darshan", "group": "darshan", "label": "Portal Main Heading"},
        {"key": "live_portal_description", "value": "Connect with the divine energy of Maa Bamleshwari Devi from anywhere in the world. Our daily live darshan stream allows devotees to participate in the morning and evening aartis.", "group": "darshan", "label": "Portal Description"},
        {"key": "aarti_morning_time", "value": "5:30 AM – 6:00 AM", "group": "darshan", "label": "Morning Aarti Hours"},
        {"key": "aarti_evening_time", "value": "7:00 PM – 7:30 PM", "group": "darshan", "label": "Evening Aarti Hours"},
        {"key": "live_alt_views", "value": '[{"id": 1, "title": "Main Sanctum", "url": "/assets/about-bg.png", "videoUrl": "https://www.youtube.com/watch?v=wulPPdw-FUk"}, {"id": 2, "title": "Temple Shikhar", "url": "/assets/hero-bg.png", "videoUrl": "https://www.youtube.com/watch?v=5qap5aO4i9A"}, {"id": 3, "title": "Navratri Aarti", "url": "/assets/gallery-festival.png", "videoUrl": "https://www.youtube.com/watch?v=1F3ROuQ3Nvg"}]', "group": "darshan", "label": "Alternative Stream Camera Views (JSON)"},
        {"key": "donate_exemption_title", "value": "Income Tax Deduction Under Section 80G", "group": "donate"},
        {"key": "donate_exemption_desc", "value": "All donations made to the Shri Bamleshwari Mandir Trust Samiti, Dongargarh, are eligible for a 50% tax exemption under Section 80G of the Indian Income Tax Act. A receipt containing the 80G registration number will be dispatched to your registered email address.", "group": "donate"}
    ]
    for i in info:
        ti = TempleInfo(**i)
        db.add(ti)
    await db.commit()
    logger.info("✅ Temple info seeded")


async def _seed_timeline(db: AsyncSession):
    from sqlalchemy import delete
    from app.models.content import TimelineEntry
    result = await db.execute(select(TimelineEntry))
    existing_items = list(result.scalars().all())
    if len(existing_items) >= 13:
        return

    # Clear old fewer entries if present to ensure full 13 chapters exist
    if len(existing_items) > 0:
        await db.execute(delete(TimelineEntry))
        await db.commit()

    entries = [
        {
            "year": "Ancient Origins", "period": "Pre-Historic",
            "title": "Volcanic Hills of Dongargarh",
            "description": "Formed millions of years ago, the hills of Dongargarh rise abruptly to 1,600 feet from the surrounding plains of Rajnandgaon, Chhattisgarh. The rocky terrain, rich with natural caves and springs, attracted sages and tribal communities who recognized it as a seat of intense spiritual energy (Shakti).",
            "image_url": "/assets/hero-bg.png",
            "quote": "Known historically as 'Dongar' (mountain/hill) and 'Garh' (fortress) in the Gond dialect.",
            "display_order": 0,
        },
        {
            "year": "200 BC", "period": "Kamavati Kingdom",
            "title": "Reign of Raja Veersen",
            "description": "According to ancient records, the city was ruled by Raja Veersen around 2,200 years ago. Being childless, he conducted severe prayers. Upon being blessed with a son, whom he named Madansen, he built a temple for Goddess Bamleshwari Devi (originally called Bambleshwari) on the high summit as an offering of eternal gratitude.",
            "image_url": "/assets/about-bg.png",
            "quote": "The name 'Bamleshwari' is believed to derive from 'Bambleshwari' or the source of cosmic power.",
            "display_order": 1,
        },
        {
            "year": "100 BC", "period": "Kamavati Dynasty",
            "title": "Era of King Kamasen",
            "description": "Raja Kamasen, the grandson of Raja Veersen, was a great patron of arts. Under his rule, the city of Kamavati became an artistic oasis. Worshippers and artists alike visited the hilltop shrine of Maa Bamleshwari to seek blessings for creativity and prosperity, spreading the temple's fame throughout ancient India.",
            "image_url": "/assets/gallery-festival.png",
            "quote": "Ancient Kamavati was known for its highly structured palaces, ponds, and hilltop watchtowers.",
            "display_order": 2,
        },
        {
            "year": "1st Century BC", "period": "Imperial Era",
            "title": "Love & Legend of Kamkandla",
            "description": "In the court of King Kamasen, a talented musician named Madhavnal fell in love with Kamkandla, a beautiful court dancer. Suspecting treason, King Kamasen banished Madhavnal. Madhavnal sought help from the legendary Emperor Vikramaditya of Ujjain, who marched to Kamavati with his forces, leading to a destructive war.",
            "image_url": "/assets/hero-bg.png",
            "quote": "Local folk plays (Chhattisgarhi Lok Natya) still narrate the epic romance of Madhavnal and Kamkandla.",
            "display_order": 3,
        },
        {
            "year": "57 BC", "period": "Paramara Dynasty",
            "title": "Vikramaditya's Penance",
            "description": "Realizing the massive loss of life during the war, Emperor Vikramaditya felt deep remorse. He sat on the hilltop and performed intense penance, offering his own head. Maa Bamleshwari appeared, stopped him, and revived both Madhavnal and the fallen soldiers. She established peace between the two kingdoms and blessed the region.",
            "image_url": "/assets/about-bg.png",
            "quote": "Legend holds that Vikramaditya established the Badi Bamleshwari idol at the top and Chhoti Bamleshwari at the base.",
            "display_order": 4,
        },
        {
            "year": "12th Century", "period": "Gond Kingdom",
            "title": "Gond and Kalachuri Patronage",
            "description": "During the medieval period, Chhattisgarh was ruled by the Kalachuris and Gond chieftains. The fortress of Dongargarh served as a military outpost. The rulers patronized the temple, maintaining the rocky paths and recognizing Maa Bamleshwari as the supreme protector of the forest lands.",
            "image_url": "/assets/gallery-festival.png",
            "quote": "The name Dongargarh itself combines Gondi/Chhattisgarhi 'Dongar' (mountain) and 'Garh' (fort).",
            "display_order": 5,
        },
        {
            "year": "1750 AD", "period": "Maratha Empire",
            "title": "Maratha Revival",
            "description": "When the Maratha Bhonsle dynasty of Nagpur took control of the Chhattisgarh region, they actively supported the temple. They built permanent steps up the hill, established lodging shelters for travelers, and organized formal administrative support for the Navratri fairs.",
            "image_url": "/assets/hero-bg.png",
            "quote": "The Bhonsle kings sent special brass lamps and silk garments to the deity during Navratri.",
            "display_order": 6,
        },
        {
            "year": "1888 AD", "period": "British Raj",
            "title": "Introduction of Railways",
            "description": "The opening of the railway line in 1888 changed the accessibility of Dongargarh. The British established a railway colony and terminal here. Devotees from Bengal, Maharashtra, and Madhya Pradesh could now easily reach the temple, elevating it to one of Central India's premier pilgrim sites.",
            "image_url": "/assets/about-bg.png",
            "quote": "Dongargarh Railway Station still has ancient steam-locomotive water towers dating back to the late 19th century.",
            "display_order": 7,
        },
        {
            "year": "1964 AD", "period": "Independent India",
            "title": "Shri Bamleshwari Mandir Trust",
            "description": "To handle the growing influx of pilgrims, local community leaders and government representatives formed the Shri Bamleshwari Mandir Trust Samiti. The trust replaced unstructured private management, directing donations towards stairs maintenance, water pipelines, and modern sanitation.",
            "image_url": "/assets/gallery-festival.png",
            "quote": "The trust manages one of the largest free community kitchens (Annakshetra) in the Rajnandgaon district.",
            "display_order": 8,
        },
        {
            "year": "1995 AD", "period": "Cultural Renaissance",
            "title": "Establishment of Pragyagiri",
            "description": "Under the guidance of Buddhist monks, the adjacent Pragyagiri hill was developed. A 30-foot tall golden statue of Lord Buddha facing east was constructed, accessible by 225 steps. It became a venue for the annual International Buddhist Conclave, adding a serene layer of cultural heritage to Dongargarh.",
            "image_url": "/assets/hero-bg.png",
            "quote": "The Pragyagiri hill offers a stunning panoramic view of Badi Bamleshwari Temple and Chhirpani lake.",
            "display_order": 9,
        },
        {
            "year": "2005 AD", "period": "Modern Infrastructure",
            "title": "Inauguration of the Ropeway",
            "description": "In response to the physically demanding 1,000-step climb, the trust and state government collaborated to install a modern passenger ropeway. Spanning from the foothills to the summit, it became a pioneering engineering feat in the state and a major tourist attraction, transporting hundreds of pilgrims hourly.",
            "image_url": "/assets/about-bg.png",
            "quote": "The ropeway offers a thrilling view of the surrounding Satpura mountain range and Dongargarh town.",
            "display_order": 10,
        },
        {
            "year": "2020 AD", "period": "National Heritage",
            "title": "PRASHAD Development Project",
            "description": "Recognizing Dongargarh's national pilgrimage value, the Ministry of Tourism, Government of India, included it in the PRASHAD scheme. This initiated major development projects, including massive pilgrim facilitation centers, parking bays, light-and-sound shows, and eco-tourism trails around the hills.",
            "image_url": "/assets/gallery-festival.png",
            "quote": "The PRASHAD project funds over ₹43 Crore of holistic tourist amenities in the Dongargarh temple precinct.",
            "display_order": 11,
        },
        {
            "year": "Present Day", "period": "Active Devotion",
            "title": "The Devotional Beacon",
            "description": "Today, Dongargarh Maa Bamleshwari Temple is a thriving center of spiritual and cultural life. Managed by the trust and supported by Chhattisgarh Tourism, it provides digital services, eco-friendly pathways, ropeways, and free meals, standing as a proud beacon of Central Indian heritage.",
            "image_url": "/assets/hero-bg.png",
            "quote": "During Navratri, more than 8,000 Jyoti Kalash (oil and ghee lamps) are lit by devotees in the temple galleries.",
            "display_order": 12,
        },
    ]
    for e in entries:
        entry = TimelineEntry(**e)
        db.add(entry)
    await db.commit()
    logger.info("✅ All 13 Timeline entries seeded")


async def _seed_seo(db: AsyncSession):
    from app.models.content import SeoEntry
    result = await db.execute(select(SeoEntry))
    if result.scalars().first():
        return
    seo_entries = [
        {
            "page_slug": "home",
            "meta_title": "Maa Bamleshwari Temple, Dongargarh — Sacred Shakti Peetha",
            "meta_description": "Visit the divine Shree Maa Bamleshwari Temple at Dongargarh, Chhattisgarh — one of the 51 Shakti Peethas. Explore history, live darshan, timings, events, and more.",
            "keywords": "Dongargarh Temple, Bamleshwari Mataji, Shakti Peetha, Chhattisgarh Temple, Ropeway",
            "robots": "index, follow",
        },
        {
            "page_slug": "gallery",
            "meta_title": "Gallery — Maa Bamleshwari Temple Dongargarh",
            "meta_description": "Browse the sacred gallery of Maa Bamleshwari Temple at Dongargarh. View festival photos, temple architecture, and divine celebrations.",
        },
        {
            "page_slug": "events",
            "meta_title": "Upcoming Events — Maa Bamleshwari Temple Dongargarh",
            "meta_description": "Stay updated with festivals, jyoti kalash, and special events at Dongargarh temple.",
        },
    ]
    for s in seo_entries:
        seo = SeoEntry(**s)
        db.add(seo)
    await db.commit()
    logger.info("✅ SEO entries seeded")


async def _seed_hero(db: AsyncSession):
    from app.models.content import HeroConfig
    result = await db.execute(select(HeroConfig))
    if result.scalars().first():
        return
    buttons = [
        {"label": "Live Darshan", "action": "darshan", "variant": "white"},
        {"label": "Temple History", "action": "history", "variant": "gold"},
        {"label": "Plan Your Visit", "action": "instructions", "variant": "transparent"},
        {"label": "Donate", "action": "donate", "variant": "maroon"}
    ]
    hero = HeroConfig(
        heading="जय माँ बम्लेश्वरी",
        heading_devanagari="जय माँ बम्लेश्वरी",
        subtitle="Welcome to Dongargarh Maa Bamleshwari Temple",
        description="Explore one of Chhattisgarh's most revered Shakti Peeths, perched majestically on the 1,600-foot high hills of Dongargarh in Rajnandgaon, drawing millions of seeking souls.",
        bg_image_url="/assets/hero-bg.png",
        bg_video_url="",
        overlay_opacity=0.5,
        buttons=buttons,
        is_active=True
    )
    db.add(hero)
    await db.commit()
    logger.info("✅ Hero config seeded")


async def _seed_stats(db: AsyncSession):
    from app.models.content import StatItem
    result = await db.execute(select(StatItem))
    if result.scalars().first():
        return
    stats = [
        {"icon": "History", "label": "Years of History", "target_value": 2200, "suffix": "+", "subtext": "Spiritual Legacy since 200 BC", "display_order": 0},
        {"icon": "Users", "label": "Temple Elevation", "target_value": 1600, "suffix": " Ft", "subtext": "Height of Badi Bamleshwari Hill", "display_order": 1},
        {"icon": "Radio", "label": "Temple Steps", "target_value": 1000, "suffix": "+", "subtext": "Steps to the Hilltop Sanctum", "display_order": 2},
        {"icon": "Clock", "label": "Annual Festivals", "target_value": 2, "suffix": " Grand", "subtext": "Chaitra & Sharadiya Navratri", "display_order": 3}
    ]
    for s in stats:
        item = StatItem(**s)
        db.add(item)
    await db.commit()
    logger.info("✅ Stats items seeded")


async def _seed_trustees(db: AsyncSession):
    from app.models.content import Trustee
    result = await db.execute(select(Trustee))
    if result.scalars().first():
        return
    trustees = [
        # Executives
        {"name": "Shri Manoj Agarwal", "position": "President", "desc": "Supervises overall temple operations, administrative decisions, and coordination with state departments and local authorities.", "display_order": 0},
        {"name": "Shri Narayan Lal Agarwal", "position": "Secretary", "desc": "Manages financial accounts, devotee coordination, welfare programs (Annakshetra), and regulatory reporting.", "display_order": 1},
        {"name": "Shri Suresh Kumar Sahu", "position": "Vice President", "desc": "Directs security, infrastructure expansions, ropeway operations, and general administrative services.", "display_order": 2},
        # Regular board members
        {"name": "Shri Rameshwar Gupta", "position": None, "desc": "Trustee board member active in administrative advisory committees.", "display_order": 3},
        {"name": "Shri Vinod Kumar Sharma", "position": None, "desc": "Trustee board member active in administrative advisory committees.", "display_order": 4},
        {"name": "Shri Anil Kumar Tiwari", "position": None, "desc": "Trustee board member active in administrative advisory committees.", "display_order": 5},
        {"name": "Shri Santosh Kumar Mishra", "position": None, "desc": "Trustee board member active in administrative advisory committees.", "display_order": 6},
        {"name": "Shri Devendra Kumar Verma", "position": None, "desc": "Trustee board member active in administrative advisory committees.", "display_order": 7},
        {"name": "Shri Dr. Vijay Kumar Patel", "position": None, "desc": "Trustee board member active in administrative advisory committees.", "display_order": 8},
        {"name": "Shri Paras Ram Sahu", "position": None, "desc": "Trustee board member active in administrative advisory committees.", "display_order": 9},
        {"name": "Shri Ghanshyam Das Agrawal", "position": None, "desc": "Trustee board member active in administrative advisory committees.", "display_order": 10}
    ]
    for t in trustees:
        item = Trustee(**t)
        db.add(item)
    await db.commit()
    logger.info("✅ Trustees seeded")


async def _seed_testimonials(db: AsyncSession):
    from app.models.content import Testimonial
    result = await db.execute(select(Testimonial))
    if result.scalars().first():
        return
    testimonials = [
        {"name": "Rajesh Sahu", "location": "Raipur, Chhattisgarh", "text": "The spiritual vibe of Dongargarh is mind-blowing! Climbing the 1,000 steps during early morning feels incredibly serene and organized. Witnessing the continuous Jyoti Kalash flames in Navratri is a blessing. The trust has done a wonderful job.", "rating": 5, "display_order": 0},
        {"name": "Dr. Deepa Sharma", "location": "Bhilai, Chhattisgarh", "text": "Visiting Maa Bamleshwari Temple during Chaitra Navratri was a divine experience. The ropeway facility makes it very accessible for elderly parents. The view of Dongargarh town and the surrounding hills from the peak is magical.", "rating": 5, "display_order": 1},
        {"name": "Vikram Dewangan", "location": "Bilaspur, Chhattisgarh", "text": "I visit every month. The online booking portal for Darshan and donations is extremely smooth. It saves hours of waiting in line during heavy rush. The temple trust provides clean drinking water, medical camps, and resting shelters all along the stairs.", "rating": 5, "display_order": 2}
    ]
    for t in testimonials:
        item = Testimonial(**t)
        db.add(item)
    await db.commit()
    logger.info("✅ Testimonials seeded")


async def _seed_instructions(db: AsyncSession):
    from app.models.content import InstructionRule, InstructionDetail
    result = await db.execute(select(InstructionRule))
    if result.scalars().first():
        return
    rules = [
        {"icon": "Compass", "title": "Dress Code Guidelines", "desc": "All devotees are requested to wear modest and respectful attire. Revealing or informal clothing is strictly prohibited inside the main temple prayer halls.", "display_order": 0},
        {"icon": "Camera", "title": "Photography Restrictions", "desc": "Photography and videography using mobile devices, professional cameras, or drones are strictly banned inside the inner sanctum (*Garbhagriha*) to preserve sanctity.", "display_order": 1},
        {"icon": "EyeOff", "title": "Prohibited Items", "desc": "Do not carry flammable items, matchboxes, weapons, or alcoholic products. Plastic bottles must be disposed of only in designated recycling bins.", "display_order": 2}
    ]
    for r in rules:
        item = InstructionRule(**r)
        db.add(item)

    details = [
        {
            "group_slug": "ropeway",
            "title": "Ropeway (Udan Khatola) Service",
            "description": "Managed by private coordinators under the trust's oversight, the ropeway transports pilgrims from the base station directly up to the Badi Bamleshwari temple peak in under 6 minutes.",
            "items": [
                "Operational Timings: 7:00 AM to 7:00 PM on weekdays, and 24 hours during Navratri. Timings may vary depending on weather conditions.",
                "Priority Boarding: Reserved queue priority available for senior citizens, physically challenged pilgrims, and pregnant women.",
                "Ticket Counter: Located at the hill base station. Online pre-booking is recommended during peak festival days."
            ],
            "display_order": 0
        },
        {
            "group_slug": "pathway",
            "title": "Walking Pathway (Stairs)",
            "description": "For devotees wishing to ascend the hill on foot, a recently upgraded pathway is available from the base containing 1,000 steps.",
            "items": [
                "Pathway Amenities: Covered steel roofs provide protection from sun/rain. Cold drinking water dispensers are situated at every 200 steps.",
                "Resting Houses: Five clean rest shelter domes with public toilets and benches are distributed along the stairs.",
                "Emergency Support: Trust emergency staff and medical support cabinets are located at the midway checkpost."
            ],
            "display_order": 1
        }
    ]
    for d in details:
        item = InstructionDetail(**d)
        db.add(item)
    await db.commit()
    logger.info("✅ Instructions and rules seeded")


async def _seed_services(db: AsyncSession):
    from app.models.content import ServiceItem
    result = await db.execute(select(ServiceItem))
    if result.scalars().first():
        return
    services = [
        {"title": "Online Donation", "desc": "Contribute to temple development, free meals (annakshetra), and educational trust funds.", "icon": "Gift", "color": "from-amber-500 to-orange-600", "action_page": "donate", "display_order": 0},
        {"title": "Flag Booking (Dhwaj)", "desc": "Reserve dates to host the sacred red flag (dhwaja) atop the high-altitude temple spire of Maa Bamleshwari.", "icon": "Flag", "color": "from-red-600 to-rose-800", "action_page": "donate", "display_order": 1},
        {"title": "Darshan Booking", "desc": "Book fast-track pass queues and senior citizen queue assistant slots online.", "icon": "Ticket", "color": "from-amber-600 to-yellow-800", "action_page": "darshan", "display_order": 2},
        {"title": "Special Pooja", "desc": "Register for custom Pujas, Jyoti Kalash booking during Navratri, and special rituals.", "icon": "Flame", "color": "from-orange-500 to-red-700", "action_page": "donate", "display_order": 3},
        {"title": "Accommodation", "desc": "Reserve a clean room, dormitory bed, or family suite at the official Bamleshwari Trust Dharamshala.", "icon": "Home", "color": "from-emerald-500 to-teal-700", "action_page": "contact", "display_order": 4},
        {"title": "Temple Gallery", "desc": "Browse a curated repository of high-resolution images of heritage festivals and architecture.", "icon": "Image", "color": "from-blue-500 to-indigo-700", "action_page": "gallery", "display_order": 5},
        {"title": "Temple History", "desc": "Read detailed notes on the 2200-year origins, Raja Veersen's dynasty, and Vikramaditya's legend.", "icon": "BookOpen", "color": "from-purple-500 to-pink-700", "action_page": "history", "display_order": 6},
        {"title": "Upcoming Events", "desc": "View schedules for Chaitra Navratri, Sharadiya Navratri, and annual celebrations.", "icon": "Calendar", "color": "from-teal-500 to-cyan-700", "action_page": "events", "display_order": 7},
        {"title": "Volunteer Work", "desc": "Register as a trust volunteer to support pilgrims during mega-festival events.", "icon": "Users", "color": "from-sky-500 to-blue-700", "action_page": "contact", "display_order": 8},
        {"title": "Contact Desk", "desc": "Get in touch with administrative officers regarding general inquiries or complaints.", "icon": "PhoneCall", "color": "from-zinc-700 to-neutral-900", "action_page": "contact", "display_order": 9}
    ]
    for s in services:
        item = ServiceItem(**s)
        db.add(item)
    await db.commit()
    logger.info("✅ Services seeded")


async def _seed_bank_details(db: AsyncSession):
    from app.models.content import BankDetail
    result = await db.execute(select(BankDetail))
    if result.scalars().first():
        return
    details = [
        {
            "label": "General Mandir Development Fund",
            "bank_name": "State Bank of India",
            "account_number": "30012345678",
            "ifsc_code": "SBIN0000366",
            "branch_name": "Dongargarh, Chhattisgarh",
            "display_order": 0
        },
        {
            "label": "Annakshetra Fund (Free Devotee Meals)",
            "bank_name": "State Bank of India",
            "account_number": "30012345999",
            "ifsc_code": "SBIN0000366",
            "branch_name": "Dongargarh, Chhattisgarh",
            "display_order": 1
        }
    ]
    for d in details:
        item = BankDetail(**d)
        db.add(item)
    await db.commit()
    logger.info("✅ Bank details seeded")


async def _seed_timings(db: AsyncSession):
    from app.models.content import TempleTiming
    result = await db.execute(select(TempleTiming))
    if result.scalars().first():
        return
    timings = [
        {"day_type": "4:00 AM", "opening_time": "4:00 AM", "closing_time": "4:30 AM", "special_note": "Temple Opening & Mangala Aarti", "display_order": 0},
        {"day_type": "5:30 AM", "opening_time": "5:30 AM", "closing_time": "6:00 AM", "special_note": "Morning Shringar & Aarti", "display_order": 1},
        {"day_type": "1:00 PM - 2:00 PM", "opening_time": "1:00 PM", "closing_time": "2:00 PM", "special_note": "Mid-day Temple Closing", "display_order": 2},
        {"day_type": "7:00 PM", "opening_time": "7:00 PM", "closing_time": "7:30 PM", "special_note": "Evening Aarti (Sandhya Aarti)", "display_order": 3},
        {"day_type": "7:00 AM - 7:00 PM", "opening_time": "7:00 AM", "closing_time": "7:00 PM", "special_note": "Passenger Ropeway Hours", "display_order": 4},
        {"day_type": "10:00 PM", "opening_time": "10:00 PM", "closing_time": "10:15 PM", "special_note": "Temple Closing (Shayan)", "display_order": 5},
        {"day_type": "8:00 AM - Onwards", "opening_time": "8:00 AM", "closing_time": "6:00 PM", "special_note": "Trust Office Hours", "display_order": 6},
        {"day_type": "Open 24 Hours", "opening_time": "12:00 AM", "closing_time": "11:59 PM", "special_note": "Navratri Special Darshan", "display_order": 7}
    ]
    for t in timings:
        item = TempleTiming(**t)
        db.add(item)
    await db.commit()
    logger.info("✅ Temple timings seeded")


async def _seed_forms(db: AsyncSession):
    from app.models.content import FormConfig
    result = await db.execute(select(FormConfig))
    if result.scalars().first():
        return
    forms = [
        {
            "slug": "contact",
            "title": "Contact Inquiry Form",
            "is_visible": True,
            "fields": [
                {"name": "name", "label": "Full Name", "type": "text", "required": True},
                {"name": "email", "label": "Email Address", "type": "email", "required": True},
                {"name": "phone", "label": "Phone Number", "type": "tel", "required": False},
                {"name": "subject", "label": "Subject", "type": "text", "required": True},
                {"name": "message", "label": "Message Content", "type": "textarea", "required": True}
            ],
            "notifications": {
                "email_to": "bmtsd72@gmail.com",
                "send_email": True,
                "auto_reply_subject": "Thank you for contacting Shri Bamleshwari Mandir Trust",
                "auto_reply_body": "Dear Devotee,\n\nWe have received your message and will review it shortly.\n\nJai Maa Bamleshwari!"
            }
        },
        {
            "slug": "donate",
            "title": "Online Donation Form",
            "is_visible": True,
            "fields": [
                {"name": "donorName", "label": "Donor's Full Name", "type": "text", "required": True},
                {"name": "donorPan", "label": "PAN Card Number (For 80G)", "type": "text", "required": True},
                {"name": "donorAmount", "label": "Donation Amount (INR)", "type": "number", "required": True},
                {
                    "name": "donationType",
                    "label": "Purpose of Donation",
                    "type": "select",
                    "required": True,
                    "options": [
                        "General Mandir Development Fund",
                        "Annakshetra (Free Pilgrim Meals)",
                        "Dhwaja Booking Spire Ceremony",
                        "Special Pooja & Havan Rituals"
                    ]
                }
            ],
            "notifications": {
                "email_to": "bmtsd72@gmail.com",
                "send_email": True,
                "auto_reply_subject": "Donation Received — Shri Bamleshwari Mandir Trust",
                "auto_reply_body": "Dear Devotee,\n\nThank you for your generous contribution. A formal tax exemption certificate under Section 80G will be generated and sent to you soon.\n\nJai Maa Bamleshwari!"
            }
        }
    ]
    for f in forms:
        form = FormConfig(**f)
        db.add(form)
    await db.commit()
    logger.info("✅ Form configurations seeded")


async def _seed_gallery(db: AsyncSession):
    from app.models.content import GalleryItem
    result = await db.execute(select(GalleryItem))
    if result.scalars().first():
        return
    gallery_items = [
        {
            "category": "temple",
            "url": "/assets/hero-bg.png",
            "alt_text": "Dongargarh Hilltop Temple",
            "caption": "An aerial illustration of Maa Bamleshwari Devi Mandir crowning the hill crest at sunrise.",
            "is_featured": True,
            "sort_order": 0
        },
        {
            "category": "festivals",
            "url": "/assets/gallery-festival.png",
            "alt_text": "Dhwaja Procession",
            "caption": "Devotees carrying a large sacred red flag (dhwaja) to hoist atop the temple spire.",
            "is_featured": True,
            "sort_order": 1
        },
        {
            "category": "aarti",
            "url": "/assets/about-bg.png",
            "alt_text": "Ganesha Sanctuary Shrine",
            "caption": "Morning prayers inside the temple complex with lit brass oil lamps (diyas).",
            "is_featured": False,
            "sort_order": 2
        },
        {
            "category": "architecture",
            "url": "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=800&auto=format&fit=crop",
            "alt_text": "Pragyagiri Buddha Statue",
            "caption": "The monumental Buddha statue located on Pragyagiri Hill, a spiritual landmark of Dongargarh.",
            "is_featured": False,
            "sort_order": 3
        },
        {
            "category": "aarti",
            "url": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=800&auto=format&fit=crop",
            "alt_text": "Evening Maha Aarti",
            "caption": "High spiritual fire offerings performed by temple priests during sunset.",
            "is_featured": False,
            "sort_order": 4
        },
        {
            "category": "nature",
            "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
            "alt_text": "Dongargarh Misty Peaks",
            "caption": "Spectacular view of Dongargarh Hill engulfed in monsoon clouds and lush greenery.",
            "is_featured": False,
            "sort_order": 5
        },
        {
            "category": "temple",
            "url": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?q=80&w=800&auto=format&fit=crop",
            "alt_text": "Chhoti Bamleshwari Temple",
            "caption": "The beautiful Chhoti Bamleshwari temple located at the base of the hill.",
            "is_featured": False,
            "sort_order": 6
        },
        {
            "category": "festivals",
            "url": "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?q=80&w=800&auto=format&fit=crop",
            "alt_text": "Navratri Celebration",
            "caption": "Thousands of Jyoti Kalash lamps illuminating the temple complex during the Navratri festival.",
            "is_featured": True,
            "sort_order": 7
        }
    ]
    for g in gallery_items:
        item = GalleryItem(**g)
        db.add(item)
    await db.commit()
    logger.info("✅ Gallery items seeded")


async def _seed_events(db: AsyncSession):
    from datetime import date
    from app.models.content import Event
    result = await db.execute(select(Event))
    if result.scalars().first():
        return
    events = [
        {
            "title": "Sharadiya Navratri Mahotsav",
            "event_date": date(2026, 10, 12),
            "end_date": date(2026, 10, 20),
            "description": "The largest annual festival at Dongargarh. The temple is kept open 24 hours for darshan. Millions of pilgrims visit, lighting thousands of Jyoti Kalash. Special trains, security, and medical camps are arranged by the Chhattisgarh Government and the Trust.",
            "banner_url": "/assets/gallery-festival.png",
            "category": "Mega Event",
            "location": "Dongargarh Hill",
            "is_featured": True,
            "is_visible": True
        },
        {
            "title": "Chaitra Navratri Utsav",
            "event_date": date(2026, 3, 28),
            "end_date": date(2026, 4, 5),
            "description": "Celebrate the sacred spring Navratri with Jyoti Kalash lighting, special Maha Aarti, and Shringar ceremonies performed daily on the hilltop shrine of Maa Bamleshwari.",
            "banner_url": "/assets/about-bg.png",
            "category": "Vasant Utsav",
            "location": "Dongargarh Hill",
            "is_featured": False,
            "is_visible": True
        },
        {
            "title": "Mandir Patotsav (Foundation Day)",
            "event_date": date(2026, 6, 20),
            "end_date": None,
            "description": "Annual Patotsav festival commemorating the temple's sacred foundation. Features special flag-hoisting (Dhwaj Arohan) atop the Badi Bamleshwari temple spire and grand Mahaprasad distribution.",
            "banner_url": "/assets/hero-bg.png",
            "category": "Annual Ritual",
            "location": "Dongargarh Hill",
            "is_featured": False,
            "is_visible": True
        }
    ]
    for e in events:
        item = Event(**e)
        db.add(item)
    await db.commit()
    logger.info("✅ Events seeded")


