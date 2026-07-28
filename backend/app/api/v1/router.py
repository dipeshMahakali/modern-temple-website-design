"""
Main API Router — assembles all sub-routers
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, public, admin_pages, admin_timeline, admin_gallery, admin_events, admin_users, admin_nav, admin_seo, admin_dashboard, admin_media, admin_temple, admin_contact

api_router = APIRouter()

# Public auth
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Public content (consumed by frontend)
api_router.include_router(public.router, prefix="/public", tags=["Public Content"])

# Admin endpoints
api_router.include_router(admin_dashboard.router, prefix="/admin/dashboard", tags=["Admin — Dashboard"])
api_router.include_router(admin_pages.router, prefix="/admin/pages", tags=["Admin — Pages"])
api_router.include_router(admin_timeline.router, prefix="/admin/timeline", tags=["Admin — Timeline"])
api_router.include_router(admin_gallery.router, prefix="/admin/gallery", tags=["Admin — Gallery"])
api_router.include_router(admin_events.router, prefix="/admin/events", tags=["Admin — Events"])
api_router.include_router(admin_users.router, prefix="/admin/users", tags=["Admin — Users"])
api_router.include_router(admin_nav.router, prefix="/admin/navigation", tags=["Admin — Navigation"])
api_router.include_router(admin_seo.router, prefix="/admin/seo", tags=["Admin — SEO"])
api_router.include_router(admin_media.router, prefix="/admin/media", tags=["Admin — Media"])
api_router.include_router(admin_temple.router, prefix="/admin/temple", tags=["Admin — Temple Info"])
api_router.include_router(admin_contact.router, prefix="/admin/contact", tags=["Admin — Contact"])
