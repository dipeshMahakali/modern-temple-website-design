"""
Pydantic v2 Schemas
Auth, User, Content
"""
from datetime import datetime, date
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, field_validator, ConfigDict


# ─── Common ──────────────────────────────────────────────────────────────────
class PaginatedResponse(BaseModel):
    total: int
    skip: int
    limit: int


# ─── Auth Schemas ─────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    avatar_url: Optional[str]
    last_login_at: Optional[datetime]
    created_at: datetime


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "viewer"

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class SessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    device_info: Optional[str]
    ip_address: Optional[str]
    created_at: datetime
    expires_at: datetime


class LoginHistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email_attempted: Optional[str]
    ip_address: Optional[str]
    user_agent: Optional[str]
    status: str
    failure_reason: Optional[str]
    created_at: datetime


# ─── Page Schemas ─────────────────────────────────────────────────────────────
class PageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    title: str
    description: Optional[str]
    status: str
    is_enabled: bool
    display_order: int
    show_in_navbar: bool
    show_in_footer: bool
    show_in_sitemap: bool
    created_at: datetime
    updated_at: datetime


class PageCreate(BaseModel):
    slug: str
    title: str
    description: Optional[str] = None
    status: str = "published"
    is_enabled: bool = True
    display_order: int = 0
    show_in_navbar: bool = True
    show_in_footer: bool = True
    show_in_sitemap: bool = True


class PageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    is_enabled: Optional[bool] = None
    display_order: Optional[int] = None
    show_in_navbar: Optional[bool] = None
    show_in_footer: Optional[bool] = None
    show_in_sitemap: Optional[bool] = None


# ─── Section Schemas ──────────────────────────────────────────────────────────
class SectionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    page_id: Optional[int]
    slug: str
    title: str
    is_visible: bool
    display_order: int
    background: Optional[str]
    animation: Optional[str]
    config: Optional[Dict]
    updated_at: datetime


class SectionCreate(BaseModel):
    slug: str
    title: str
    page_id: Optional[int] = None
    is_visible: bool = True
    display_order: int = 0
    background: Optional[str] = None
    animation: Optional[str] = None
    config: Optional[Dict] = None


class SectionUpdate(BaseModel):
    title: Optional[str] = None
    is_visible: Optional[bool] = None
    display_order: Optional[int] = None
    background: Optional[str] = None
    animation: Optional[str] = None
    config: Optional[Dict] = None


# ─── Timeline Schemas ─────────────────────────────────────────────────────────
class TimelineEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    year: str
    period: Optional[str]
    title: str
    description: str
    image_url: Optional[str]
    quote: Optional[str]
    display_order: int
    is_visible: bool
    updated_at: datetime


class TimelineEntryCreate(BaseModel):
    year: str
    period: Optional[str] = None
    title: str
    description: str
    image_url: Optional[str] = None
    quote: Optional[str] = None
    display_order: int = 0
    is_visible: bool = True


class TimelineEntryUpdate(BaseModel):
    year: Optional[str] = None
    period: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    quote: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


# ─── Gallery Schemas ──────────────────────────────────────────────────────────
class GalleryItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    category: str
    url: str
    compressed_url: Optional[str]
    alt_text: Optional[str]
    caption: Optional[str]
    is_featured: bool
    is_visible: bool
    sort_order: int
    updated_at: datetime


class GalleryItemCreate(BaseModel):
    category: str = "general"
    url: str
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    is_featured: bool = False
    is_visible: bool = True
    sort_order: int = 0


class GalleryItemUpdate(BaseModel):
    category: Optional[str] = None
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    is_featured: Optional[bool] = None
    is_visible: Optional[bool] = None
    sort_order: Optional[int] = None


# ─── Event Schemas ────────────────────────────────────────────────────────────
class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    event_date: date
    end_date: Optional[date]
    description: Optional[str]
    banner_url: Optional[str]
    location: Optional[str]
    category: str
    is_visible: bool
    is_featured: bool
    updated_at: datetime


class EventCreate(BaseModel):
    title: str
    event_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None
    banner_url: Optional[str] = None
    location: Optional[str] = None
    category: str = "festival"
    is_visible: bool = True
    is_featured: bool = False


class EventUpdate(BaseModel):
    title: Optional[str] = None
    event_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    banner_url: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    is_visible: Optional[bool] = None
    is_featured: Optional[bool] = None


# ─── Navigation Schemas ───────────────────────────────────────────────────────
class NavigationItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    label: str
    slug: str
    icon: Optional[str]
    parent_id: Optional[int]
    display_order: int
    is_visible: bool
    target: str
    status: str
    location: str
    updated_at: datetime


class NavigationItemCreate(BaseModel):
    label: str
    slug: str
    icon: Optional[str] = None
    parent_id: Optional[int] = None
    display_order: int = 0
    is_visible: bool = True
    target: str = "_self"
    location: str = "main"


class NavigationItemUpdate(BaseModel):
    label: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[int] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None
    target: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None


# ─── SEO Schemas ──────────────────────────────────────────────────────────────
class SeoEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    page_slug: str
    meta_title: Optional[str]
    meta_description: Optional[str]
    keywords: Optional[str]
    og_title: Optional[str]
    og_description: Optional[str]
    og_image: Optional[str]
    twitter_card: Optional[str]
    canonical_url: Optional[str]
    robots: str
    json_ld: Optional[Dict]
    updated_at: datetime


class SeoEntryUpsert(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    twitter_card: Optional[str] = None
    canonical_url: Optional[str] = None
    robots: str = "index, follow"
    json_ld: Optional[Dict] = None


# ─── Temple Info Schemas ──────────────────────────────────────────────────────
class TempleInfoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    key: str
    value: str
    group: str
    label: Optional[str]
    display_order: int


class TempleInfoUpsert(BaseModel):
    key: str
    value: str
    group: str = "general"
    label: Optional[str] = None


# ─── Contact Schemas ──────────────────────────────────────────────────────────
class ContactMessageCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str


class ContactMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: Optional[str]
    phone: Optional[str]
    subject: Optional[str]
    message: str
    is_read: bool
    created_at: datetime


# ─── Audit Log Schemas ────────────────────────────────────────────────────────
class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: Optional[int]
    action: str
    entity_type: Optional[str]
    entity_id: Optional[int]
    entity_label: Optional[str]
    old_value: Optional[Dict]
    new_value: Optional[Dict]
    ip_address: Optional[str]
    notes: Optional[str]
    created_at: datetime


# ─── Dashboard Stats ──────────────────────────────────────────────────────────
class DashboardStats(BaseModel):
    total_pages: int
    published_pages: int
    hidden_pages: int
    gallery_images: int
    events: int
    unread_messages: int
    total_users: int
    recent_logins: int
