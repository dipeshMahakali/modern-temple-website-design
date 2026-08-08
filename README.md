# 🛕 Dongargarh Maa Bamleshwari Temple — Enterprise Web Portal & CMS

A state-of-the-art, dynamic, database-driven web portal and Enterprise Content Management System (CMS) for the world-famous **Maa Bamleshwari Devi Temple** in Dongargarh, Chhattisgarh.

Designed with rich aesthetics, glassmorphism, dynamic micro-animations, and full administrative control over every visible element.

---

## ✨ Features & Functionality

### 🌐 Public Web Application
- **Hero Banner & Divine Audio Player**: Dynamic background images/videos, devanagari calligraphy, quick action buttons, and continuous sacred ambient chanting player with custom controls.
- **Interactive 13-Chapter Historical Timeline**: Complete chronological chronicle from ancient volcanic rock formation (Pre-Historic) to present-day PRASHAD scheme development. Includes dynasty tags, quotes, facts, and smooth era navigation.
- **Live Darshan & Camera View Swapper**:
  - Live broadcast stream with YouTube embed integration.
  - Interactive **Alternative Camera Views** (Main Sanctum, Temple Shikhar, Navratri Aarti, etc.).
  - Smooth **Framer Motion** spring animations that swap clicked camera angles into the main player window seamlessly.
- **Dynamic Photo Gallery**:
  - Filterable categories (*Temple*, *Festivals*, *Aarti*, *Architecture*, *Nature*).
  - Clean 4:3 cover ratio layout with zero white gaps.
  - Interactive Lightbox modal with keyboard navigation.
- **Festival & Event Showcase**: Upcoming religious events, festival dates, locations, and descriptions.
- **Trustees Board & Leadership**: Profiles of temple trust executives and committee members.
- **Pilgrim Instructions & Guidelines**: Do's & Don'ts, code of conduct, dress code, photography policies, and safety instructions.
- **Seva & Services Directory**: Online pass booking, VIP darshan, Annakshetra (free community dining), ropeway passes, and wheelchair assistance.
- **Temple Timings & Aarti Schedule**: Seasonal opening/closing times, Morning Aarti, Evening Aarti, and special festival hours.
- **Donations & 80G Tax Exemption**: Bank details, UPI QR scanner, account numbers, IFSC codes, and 80G tax exemption disclosures.
- **Contact & Prayer Requests**: Interactive contact form with category selector (General Query, Puja Booking, Donation, Volunteer).

---

### 🛡️ Enterprise Admin Panel (`/admin`)
- **Dashboard Analytics**: Real-time counters for active pages, dynamic sections, uploaded media assets, registered users, and system health status.
- **Image Upload & Media Library (`/admin/media`)**:
  - Drag & Drop file uploader with file picker and direct URL input.
  - Folder categorization (`hero`, `gallery`, `events`, `timeline`, `trustees`, `temple`).
  - Copy URL to clipboard and single-click file deletion.
  - Integrated modal selector inside all admin forms (`<ImageUploader />`).
- **Hero & Banner Configurator (`/admin/hero`)**: Change headings, Devanagari text, subtitles, background images/videos, overlay opacity, and CTA buttons.
- **Historical Timeline Manager (`/admin/timeline`)**: Full CRUD over all 13 historical chapters, era titles, descriptions, quotes, and timeline imagery.
- **Live Darshan & Stream Manager (`/admin/temple-info`)**: Dedicated manager to add, edit, or delete title-specific YouTube video links and thumbnail images for alternative camera views.
- **Photo Gallery Manager (`/admin/gallery`)**: Add, edit, feature, hide, or delete photo gallery items.
- **Events Manager (`/admin/events`)**: Create and update temple festivals, dates, banners, and locations.
- **Trustees Manager (`/admin/trustees`)**: Manage board members, positions, and bio descriptions.
- **SEO & Metadata Manager (`/admin/seo`)**: Manage Meta Titles, Descriptions, OpenGraph images, Twitter Cards, Canonical URLs, and Schema.org JSON-LD structured data.
- **User Management & Security (`/admin/users`)**: Create admin users, manage roles (`admin`, `editor`), view login lockouts, and reset passwords.
- **Audit Logging (`/admin/audit-logs`)**: Complete security trail tracking every admin action, entity modifications, IP addresses, and timestamps.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Vanilla CSS3 Design Tokens + Tailwind CSS v4 + Glassmorphism
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios with JWT Interceptors & Auto Refresh

### Backend API
- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **ORM**: SQLAlchemy 2.0 (Async) + Alembic migrations
- **Authentication**: OAuth2 Password Flow + JWT Access Tokens & Refresh Tokens + Passlib (Bcrypt)
- **Static File Handling**: FastAPI StaticFiles (`/uploads`)

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/Pavagarh-Web.git
cd Pavagarh-Web

# Frontend dependencies
npm install

# Backend virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 2. Seed Initial Database & Admin User
```bash
cd backend
source venv/bin/activate
python3 -c "import asyncio; from app.core.seeder import seed_initial_data; asyncio.run(seed_initial_data())"
cd ..
```

### 3. Run Development Servers
- **Start Backend API** (Port 8000):
  ```bash
  cd backend
  source venv/bin/activate
  uvicorn main:app --reload --host 0.0.0.0 --port 8000
  ```

- **Start Frontend App** (Port 5174):
  ```bash
  npm run dev -- --port 5174
  ```

- **Access Applications**:
  - 🌐 Public Website: `http://localhost:5174`
  - 🛡️ Admin Panel: `http://localhost:5174/admin`
  - 🔑 Admin Credentials: Email `admin@temple.com` | Password `Admin@123!`
  - 📖 API Docs (Swagger): `http://localhost:8000/docs`

---

## 🚀 Lifetime Free Deployment

For step-by-step instructions on hosting this application for **100% free forever** on **Render**, **Vercel**, and **Supabase**, refer to the [DEPLOYMENT.md](file:///var/www/html/dipesh/Pavagarh-Web/DEPLOYMENT.md) guide.

---

## 📄 License
This project is proprietary and maintained for the **Shri Bamleshwari Mandir Trust Samiti, Dongargarh**.
