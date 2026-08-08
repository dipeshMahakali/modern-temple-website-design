# 🚀 Lifetime Free-Tier Deployment Guide

This guide provides step-by-step instructions to deploy the **Dongargarh Maa Bamleshwari Temple Portal & Enterprise CMS** for **100% free forever** using industry-standard free-tier cloud platforms.

---

## 🏗️ Architecture for Free Hosting

| Component | Platform | Free Tier Specifications |
| :--- | :--- | :--- |
| **Frontend Web App** | **Vercel** / **Netlify** | Unlimited bandwidth, global CDN, instant Git deploys |
| **Backend API** | **Render** / **Railway** | 512 MB RAM, free web service instance |
| **Database** | **Render PostgreSQL** / **Supabase** / **Neon** | 1 GB storage, managed PostgreSQL |
| **Media Storage** | Local Disk (`/uploads`) / **Cloudinary** | Free local disk or 25 GB Cloudinary media storage |

---

## 📋 Step 1: Database Setup (Free PostgreSQL)

### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Create a new project named `bamleshwari-temple-db`.
3. Go to **Project Settings -> Database** and copy the **Connection String (URI)**:
   ```env
   postgresql+asyncpg://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Option B: Render PostgreSQL
1. Sign up at [render.com](https://render.com).
2. Click **New + -> PostgreSQL**.
3. Name: `bamleshwari-db`, Region: Oregon (or nearest).
4. Copy the **Internal Database URL** or **External Database URL**.

---

## 🐍 Step 2: Backend API Deployment (Render)

1. Push your project code to a GitHub repository.
2. In [Render Dashboard](https://dashboard.render.com), click **New + -> Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Name**: `bamleshwari-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

5. **Environment Variables**:
   Add the following variables under **Environment**:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgresql+asyncpg://...` | Connection URI from Step 1 |
   | `JWT_SECRET` | `your-secure-random-32-char-secret-key` | Secret key for JWT auth |
   | `ENVIRONMENT` | `production` | Set to production |
   | `CORS_ORIGINS` | `https://your-frontend.vercel.app` | Your Vercel frontend URL |

6. Click **Create Web Service**. Render will build and deploy your API automatically (e.g. `https://bamleshwari-api.onrender.com`).

---

## ⚡ Step 3: Database Seeding (Production)

Once your Render backend is live, run the initial seeder to populate all 13 timeline chapters, photo gallery, festivals, and temple settings:

1. Open Render Shell (in Web Service Dashboard -> **Shell** tab) or run remotely:
   ```bash
   python3 -c "import asyncio; from app.core.seeder import seed_initial_data; asyncio.run(seed_initial_data())"
   ```
2. You will see:
   ```
   ✅ Admin user seeded (admin@temple.com)
   ✅ All 13 Timeline entries seeded
   ✅ Gallery & Events seeded successfully
   ```

---

## 🎨 Step 4: Frontend Deployment (Vercel)

1. Sign up at [vercel.com](https://vercel.com).
2. Click **Add New -> Project** and select your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   Add the following environment variable:

   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://bamleshwari-api.onrender.com/api/v1` |

5. Click **Deploy**. Vercel will build and publish your web app (e.g. `https://bamleshwari-temple.vercel.app`).

---

## 🔄 Step 5: SPA Rewrites & Verification

To support single-page client routing (`/admin`, `/history`, `/gallery`, `/events`) on Vercel:

The project includes a `vercel.json` in the root:
```json
{
  "rewrites": [
    {
      "source": "/uploads/(.*)",
      "destination": "https://bamleshwari-api.onrender.com/uploads/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### ✅ Verification Checklist
- [x] Access `https://your-frontend.vercel.app` — Public website loads.
- [x] Navigate to `/admin` and log in with `admin@temple.com` / `Admin@123!`.
- [x] Upload an image in **Media Library** (`/admin/media`) or **Hero** (`/admin/hero`).
- [x] Verify images render correctly across public sections.
- [x] Test **Live Darshan** camera view swapping animations.
