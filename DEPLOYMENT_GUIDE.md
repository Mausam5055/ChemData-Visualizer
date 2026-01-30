<div align="center">

# 🚀 Deployment Guide

### Production Deployment on Render & Vercel

[![Render](https://img.shields.io/badge/Render-Deployment-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**Complete guide for deploying ChemData Visualizer to production using free cloud services**

[Overview](#-deployment-overview) • [Backend](#-backend-deployment-render) • [Frontend](#-frontend-deployment-vercel) • [Troubleshooting](#-troubleshooting)

</div>

---

## 📋 Deployment Overview

This guide covers deploying the **ChemData Visualizer** full-stack application using:

- **Backend + API**: Render.com (Free tier)
- **Frontend (Web)**: Vercel (Free tier)
- **Desktop App**: Standalone executable (PyInstaller)

### Deployment Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        USERS[👥 End Users]
        DESKTOP[🖥️ Desktop App<br/>Local Executable]
    end

    subgraph "Vercel (Frontend)"
        REACT[⚡ React App<br/>Static Hosting]
        CDN[🌐 Vercel CDN<br/>Global Distribution]
    end

    subgraph "Render (Backend)"
        GUNICORN[🔧 Gunicorn<br/>WSGI Server]
        DJANGO[⚡ Django API<br/>REST Framework]
        DB[(💾 Database<br/>Ephemeral Storage)]
    end

    USERS -->|HTTPS| CDN
    CDN --> REACT
    DESKTOP -->|API Calls| GUNICORN
    REACT -->|API Calls| GUNICORN
    GUNICORN --> DJANGO
    DJANGO --> DB

    style USERS fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style REACT fill:#61DAFB,stroke:#1565C0,stroke-width:2px,color:#000
    style DJANGO fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style DB fill:#607D8B,stroke:#37474F,stroke-width:2px,color:#fff
```

---

## ⚠️ Critical Warnings & Limitations

### 1. 🛑 Ephemeral Storage on Free Tiers

> [!CAUTION]
> **CRITICAL**: Free cloud platforms like Render have **ephemeral file systems**. This means:
>
> - **Database files (SQLite) are deleted** on every restart/deployment
> - **Uploaded media files (CSVs/PDFs) are deleted** on container restart
> - **Data persists only during active session**

**Why?**  
Containerized services destroy and recreate containers for each deployment.

**Solution for Production:**

- Use **external PostgreSQL database** (Render paid tier, Neon, or Supabase free tier)
- Use **cloud storage** for media files (AWS S3, Cloudinary, or Azure Blob)

### 2. ⏳ Render Free Tier "Spin Down"

Free web services on Render **spin down after 15 minutes** of inactivity.

**Impact:**

- First request after inactivity takes **30-50 seconds** to wake up
- Subsequent requests are fast

**Solutions:**

1. **Uptime Monitor** (UptimeRobot) - Ping every 10-14 minutes
2. **Upgrade to Paid** - $7/month for always-on service
3. **Accept Cold Starts** - For demo/portfolio projects

### 3. 📊 Free Tier Comparison

| Platform          | Backend (Render) | Frontend (Vercel) |
| ----------------- | ---------------- | ----------------- |
| **Cost**          | Free             | Free              |
| **Storage**       | Ephemeral ⚠️     | Static only       |
| **Bandwidth**     | 100 GB/month     | Unlimited         |
| **Build Time**    | 500 hours/month  | Unlimited builds  |
| **Cold Start**    | Yes (15 min)     | No                |
| **Custom Domain** | Yes              | Yes               |
| **SSL**           | Free (Auto)      | Free (Auto)       |

---

## 🔧 Part 1: Backend Deployment (Render)

### Prerequisites

- [ ] Code pushed to **GitHub repository**
- [ ] `requirements.txt` in `backend/` folder
- [ ] `.env.example` file with all required variables
- [ ] Render account created

### Step 1: Prepare Backend for Production

1. **Add Gunicorn to requirements.txt**

Edit `backend/requirements.txt`:

```txt
django>=5.0
djangorestframework
django-cors-headers
pandas
reportlab
django-allauth
dj-rest-auth
python-dotenv
matplotlib
requests
PyJWT
cryptography
requests-oauthlib
gunicorn  # Add this line
```

2. **Create `build.sh` (Optional)**

Create `backend/build.sh`:

```bash
#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --no-input
```

Make it executable:

```bash
chmod +x backend/build.sh
```

3. **Update Django Settings for Production**

Edit `backend/core/settings.py`:

```python
import os
from pathlib import Path

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-key-for-dev')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',') if os.getenv('ALLOWED_HOSTS') else ['*']

# CORS Settings
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
CORS_ALLOW_CREDENTIALS = True
```

### Step 2: Deploy to Render

1. **Login to Render Dashboard**
   - Go to [dashboard.render.com](https://dashboard.render.com/)
   - Sign up or login with GitHub

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Grant Render access to the repository

3. **Configure Service**

| Setting            | Value                                                         |
| ------------------ | ------------------------------------------------------------- |
| **Name**           | `chemdata-backend` (or your choice)                           |
| **Region**         | Closest to your users (e.g., Singapore, Frankfurt, Oregon)    |
| **Branch**         | `main` or `master`                                            |
| **Root Directory** | `backend` ⚠️ **Important!**                                   |
| **Runtime**        | **Python 3**                                                  |
| **Build Command**  | `pip install -r requirements.txt && python manage.py migrate` |
| **Start Command**  | `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`         |

4. **Set Environment Variables**

Click **"Environment"** tab and add:

| Key                         | Value                           | Notes                              |
| --------------------------- | ------------------------------- | ---------------------------------- |
| `PYTHON_VERSION`            | `3.10.12`                       | Match your local version           |
| `SECRET_KEY`                | Generate strong key             | Use Django secret key generator    |
| `DEBUG`                     | `False`                         | Security: Never True in production |
| `ALLOWED_HOSTS`             | `chemdata-backend.onrender.com` | Your Render domain                 |
| `CORS_ALLOWED_ORIGINS`      | `https://yourapp.vercel.app`    | Add after Vercel deployment        |
| `DJANGO_SUPERUSER_USERNAME` | `admin`                         | **NEW:** Auto-creates superuser    |
| `DJANGO_SUPERUSER_EMAIL`    | `admin@example.com`             | **NEW:** Auto-creates superuser    |
| `DJANGO_SUPERUSER_PASSWORD` | `your-strong-password`          | **NEW:** Auto-creates superuser    |

**Generate SECRET_KEY:**

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

5. **Deploy**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for initial deployment
   - Wait 5-10 minutes for initial deployment
   - Check logs for errors
   - **Note:** The build script will automatically run `python create_superuser.py`. If you set the `DJANGO_SUPERUSER_...` variables, your admin account will be ready immediately.

### Step 3: Test Backend API

Once deployed, test your API:

```bash
# Get your Render URL
curl https://chemdata-backend.onrender.com/api/datasets/

# Should return 401 Unauthorized (good - auth is working)
```

### Step 4: Keep Service Awake (Optional)

Use **UptimeRobot** to prevent spin-down:

1. Sign up at [uptimerobot.com](https://uptimerobot.com/) (Free)
2. Click **"Add New Monitor"**
3. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: ChemData Backend
   - **URL**: `https://your-app.onrender.com/api/datasets/`
   - **Monitoring Interval**: Every 10 minutes (minimum)

> [!NOTE]
> This will consume your Render free tier hours faster, but keeps the app responsive.

---

## 🌐 Part 2: Frontend Deployment (Vercel)

### Prerequisites

- [ ] Backend deployed and URL available
- [ ] `web-frontend/` folder in repository
- [ ] Vercel account created

### Step 1: Prepare Frontend

1. **Configure API URL**

The frontend uses environment variables. Vercel will provide these at build time.

2. **Update API Calls**

Ensure your API service in `web-frontend/src/services/api.js` (or similar) uses:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
```

### Step 2: Deploy to Vercel

1. **Login to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Sign up or login with GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Select your GitHub repository
   - Click **"Import"**

3. **Configure Project**

| Setting              | Value                                     |
| -------------------- | ----------------------------------------- |
| **Framework Preset** | **Vite** (auto-detected)                  |
| **Root Directory**   | `web-frontend` ⚠️ Click "Edit" and select |
| **Build Command**    | `npm run build` (auto-detected)           |
| **Output Directory** | `dist` (auto-detected)                    |
| **Install Command**  | `npm install` (auto-detected)             |

4. **Set Environment Variables**

Click **"Environment Variables"** and add:

| Name                    | Value                                   | Notes                                       |
| ----------------------- | --------------------------------------- | ------------------------------------------- |
| `VITE_API_URL`          | `https://chemdata-backend.onrender.com` | Your Render backend URL (no trailing slash) |
| `VITE_GOOGLE_CLIENT_ID` | `your-client-id`                        | Optional: For Google OAuth                  |

> [!IMPORTANT]
> Environment variables in Vite MUST be prefixed with `VITE_` to be accessible in browser.

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-5 minutes for build
   - Get your deployment URL (e.g., `https://chemdata.vercel.app`)

### Step 3: Update Backend CORS Settings

1. Go back to **Render Dashboard**
2. Navigate to your backend service
3. Click **"Environment"**
4. Update `CORS_ALLOWED_ORIGINS`:
   ```
   https://chemdata.vercel.app,https://www.chemdata.vercel.app
   ```
5. Save and wait for automatic redeploy

---

## 🔗 Part 3: Connecting Frontend & Backend

### Update CORS Configuration

**Backend (`backend/core/settings.py`):**

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",          # Local development
    "https://chemdata.vercel.app",    # Production
    "https://www.chemdata.vercel.app", # With www
]

# Or for testing (NOT recommended for production)
# CORS_ALLOW_ALL_ORIGINS = True
```

Commit and push changes - Render will auto-redeploy.

### Verify Integration

1. Open your Vercel URL: `https://chemdata.vercel.app`
2. Try to login or register
3. Check browser console (F12) for errors:
   - **CORS errors** → Update backend CORS settings
   - **404 errors** → Check API URL is correct
   - **Network errors** → Backend may be spinning down (wait 30s)

---

## 📊 Part 4: Database & Storage Solutions

### Option 1: Accept Ephemeral Storage (Demo/Portfolio)

**Pros:**

- ✅ Free
- ✅ Simple setup
- ✅ Fast deployment

**Cons:**

- ❌ Data resets on deployment
- ❌ Not suitable for production use

**Use For:** Portfolio projects, demos, testing

### Option 2: External PostgreSQL Database

**Free Options:**

| Provider        | Free Tier    | Limitations          |
| --------------- | ------------ | -------------------- |
| **Neon**        | 3 GB storage | 1 branch, serverless |
| **Supabase**    | 500 MB       | 2 projects           |
| **Render**      | $7/month     | 1 GB storage (paid)  |
| **ElephantSQL** | 20 MB        | Very limited         |

**Setup with Neon (Recommended):**

1. Sign up at [neon.tech](https://neon.tech/)
2. Create new project
3. Copy connection string
4. Add to Render environment:
   ```
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
   ```
5. Update Django settings to use `DATABASE_URL`

### Option 3: Cloud Media Storage

For uploaded files (CSVs, PDFs):

**Options:**

- **AWS S3** - 5 GB free tier
- **Cloudinary** - 10 GB free tier (images/media)
- **Azure Blob Storage** - 5 GB free

**Setup with django-storages:**

```bash
pip install django-storages boto3  # For S3
```

Update settings:

```python
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_STORAGE_BUCKET_NAME = 'your-bucket'
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
```

---

## 🖥️ Part 5: Desktop App Deployment

### Build Windows Executable

```bash
cd desktop-frontend
pip install pyinstaller

# Build standalone .exe
pyinstaller --noconsole --onefile \
  --icon=assets/logo.ico \
  --name="ChemDataVisualizer" \
  main.py
```

**Output:** `dist/ChemDataVisualizer.exe`

### Update API URL for Production

Edit `config.py` before building:

```python
API_URL = "https://chemdata-backend.onrender.com/api/"
```

### Distribution

- Upload `.exe` to GitHub Releases
- Share download link with users
- Consider code signing certificate for trust

---

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] All code committed and pushed to GitHub
- [ ] `requirements.txt` includes `gunicorn`
- [ ] Environment variables documented in `.env.example`
- [ ] DEBUG set to False in production
- [ ] SECRET_KEY is strong and unique
- [ ] CORS origins configured correctly

### Backend (Render)

- [ ] Web service created and deployed
- [ ] Environment variables configured
- [ ] Migrations run successfully
- [ ] API endpoints accessible
- [ ] Static files collected

### Frontend (Vercel)

- [ ] Project imported and deployed
- [ ] Environment variables set (VITE_API_URL)
- [ ] Build completes successfully
- [ ] Site accessible via Vercel URL
- [ ] API calls work correctly

### Post-Deployment

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test file upload (aware of ephemeral storage)
- [ ] Test data visualization
- [ ] Test PDF generation
- [ ] Setup uptime monitoring (optional)
- [ ] Configure custom domain (optional)

---

## 💡 Cost Optimization

### Free Tier Limits

| Service    | Monthly Limit    | Overage Cost                 |
| ---------- | ---------------- | ---------------------------- |
| **Render** | 750 hours        | Paid plans start at $7/month |
| **Vercel** | Unlimited builds | Unlimited for hobby projects |
| **Neon**   | 3 GB storage     | $19/month for Pro            |

### Tips to Stay Free

1. **Use Serverless Functions** - Lower compute time
2. **Optimize Images** - Reduce bandwidth usage
3. **Cache Static Assets** - Vercel does this automatically
4. **Limit Background Jobs** - Don't run continuous processes
5. **Monitor Usage** - Check dashboards regularly

---

## 🐛 Troubleshooting

### Backend Issues

| Issue                      | Solution                                           |
| -------------------------- | -------------------------------------------------- |
| **Build fails on Render**  | Check Python version matches requirements          |
| **Migrations fail**        | Ensure `python manage.py migrate` in build command |
| **Static files not found** | Run `collectstatic` in build script                |
| **CORS errors**            | Verify frontend URL in `CORS_ALLOWED_ORIGINS`      |
| **Service won't start**    | Check Gunicorn command format                      |
| **Database resets**        | Expected with ephemeral storage - use external DB  |

### Frontend Issues

| Issue                            | Solution                                                   |
| -------------------------------- | ---------------------------------------------------------- |
| **Build fails on Vercel**        | Check `package.json` scripts are correct                   |
| **API calls fail**               | Verify `VITE_API_URL` is set correctly (no trailing slash) |
| **Environment vars not working** | Must prefix with `VITE_`                                   |
| **404 on page refresh**          | Vite handles this automatically for SPA                    |
| **Slow initial load**            | Backend may be spinning down - wait 30s                    |

### Common Errors

**"Application Error" on Render:**

```bash
# Check logs in Render dashboard
# Common causes:
# 1. Missing environment variables
# 2. Database connection failed
# 3. Import errors in code
```

**CORS Policy Error:**

```
Access to fetch at 'https://backend.com/api/' from origin 'https://frontend.com'
has been blocked by CORS policy
```

**Fix:** Add frontend URL to backend `CORS_ALLOWED_ORIGINS`

---

## 📊 Monitoring & Analytics

### Recommended Tools

| Tool                 | Purpose          | Cost                |
| -------------------- | ---------------- | ------------------- |
| **UptimeRobot**      | Monitor uptime   | Free                |
| **Sentry**           | Error tracking   | Free tier available |
| **Google Analytics** | User analytics   | Free                |
| **Render Metrics**   | Server metrics   | Built-in            |
| **Vercel Analytics** | Frontend metrics | Free tier           |

---

## 🎯 Production-Ready Enhancements

For production use beyond free tiers:

1. **Database**
   - Use managed PostgreSQL (Render $7/month, Neon $19/month)
   - Set up automated backups
   - Enable connection pooling

2. **Media Storage**
   - Integrate AWS S3 or Cloudinary
   - Configure CDN for faster delivery
   - Set up proper access controls

3. **Security**
   - Enable HTTPS everywhere (automatic on Render/Vercel)
   - Implement rate limiting
   - Add CSRF protection
   - Use environment-specific secrets

4. **Performance**
   - Enable Redis caching
   - Optimize database queries
   - Compress static assets
   - Implement lazy loading

5. **Monitoring**
   - Set up error tracking (Sentry)
   - Configure uptime alerts
   - Monitor API response times
   - Track user analytics

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Root README](../README.md) - Project documentation

---

## 👨‍💻 Author

**Mausam Kar**

- Portfolio: [mausam04.vercel.app](https://mausam04.vercel.app)

---

<div align="center">

**[⬆ Back to Top](#-deployment-guide)**

_Deploy with confidence using modern cloud platforms_

</div>
