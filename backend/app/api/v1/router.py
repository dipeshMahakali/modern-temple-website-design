"""
Main API Router — assembles all sub-routers
"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth, public, admin_pages, admin_timeline, admin_gallery, admin_events,
    admin_users, admin_nav, admin_seo, admin_dashboard, admin_media,
    admin_temple, admin_contact, admin_sections, admin_stats, admin_trustees,
    admin_testimonials, admin_instructions, admin_services, admin_bank_details,
    admin_timings, admin_hero, admin_forms, admin_audit
)

api_router = APIRouter()

# Public auth
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Public content (consumed by frontend)
api_router.include_router(public.router, prefix="/public", tags=["Public Content"])

# Admin endpoints
api_router.include_router(admin_dashboard.router, prefix="/admin/dashboard", tags=["Admin — Dashboard"])
api_router.include_router(admin_pages.router, prefix="/admin/pages", tags=["Admin — Pages"])
api_router.include_router(admin_sections.router, prefix="/admin/sections", tags=["Admin — Sections"])
api_router.include_router(admin_timeline.router, prefix="/admin/timeline", tags=["Admin — Timeline"])
api_router.include_router(admin_gallery.router, prefix="/admin/gallery", tags=["Admin — Gallery"])
api_router.include_router(admin_events.router, prefix="/admin/events", tags=["Admin — Events"])
api_router.include_router(admin_users.router, prefix="/admin/users", tags=["Admin — Users"])
api_router.include_router(admin_nav.router, prefix="/admin/navigation", tags=["Admin — Navigation"])
api_router.include_router(admin_seo.router, prefix="/admin/seo", tags=["Admin — SEO"])
api_router.include_router(admin_media.router, prefix="/admin/media", tags=["Admin — Media"])
api_router.include_router(admin_temple.router, prefix="/admin/temple", tags=["Admin — Temple Info"])
api_router.include_router(admin_contact.router, prefix="/admin/contact", tags=["Admin — Contact"])
api_router.include_router(admin_stats.router, prefix="/admin/stats", tags=["Admin — Stats"])
api_router.include_router(admin_trustees.router, prefix="/admin/trustees", tags=["Admin — Trustees"])
api_router.include_router(admin_testimonials.router, prefix="/admin/testimonials", tags=["Admin — Testimonials"])
api_router.include_router(admin_instructions.router, prefix="/admin/instructions", tags=["Admin — Instructions"])
api_router.include_router(admin_services.router, prefix="/admin/services", tags=["Admin — Services"])
api_router.include_router(admin_bank_details.router, prefix="/admin/bank-details", tags=["Admin — Bank Details"])
api_router.include_router(admin_timings.router, prefix="/admin/timings", tags=["Admin — Timings"])
api_router.include_router(admin_hero.router, prefix="/admin/hero", tags=["Admin — Hero"])
api_router.include_router(admin_forms.router, prefix="/admin/forms", tags=["Admin — Forms"])
api_router.include_router(admin_audit.router, prefix="/admin/audit-logs", tags=["Admin — Audit Logs"])

