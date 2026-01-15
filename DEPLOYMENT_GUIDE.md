# 🚀 Deployment Guide - Real Estate ML Project

## Overview
This guide will help you deploy your Real Estate ML project using:
- **Render** → Backend (Node.js + Python ML)
- **Vercel** → Frontend (React/Vite)

---

## 📋 Prerequisites
- GitHub account
- Render account (free tier available at render.com)
- Vercel account (free tier available at vercel.com)

---

## Step 1: Push to GitHub

### 1.1 Create GitHub Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `real-estate-ml-project` (or your preferred name)
3. Keep it **Public** or **Private** (both work)
4. **DO NOT** initialize with README (you already have one)

### 1.2 Push Your Code

Open terminal in your project root and run:

```bash
# Check if git is initialized (you already have .git folder)
git status

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/real-estate-ml-project.git

# Push to GitHub
git push -u origin main
```

> **Note:** If it says branch is `master` instead of `main`, use: `git push -u origin master`

---

## Step 2: Deploy Backend on Render

### 2.1 Create Web Service on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Settings:**
- **Name:** `real-estate-backend`
- **Region:** Choose closest to your users
- **Branch:** `main` (or `master`)
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** 
  ```bash
  npm install && pip install -r ../ml/requirements.txt
  ```
- **Start Command:** 
  ```bash
  node server.js
  ```
- **Instance Type:** Free

### 2.2 Environment Variables (if needed)
Add in Render dashboard:
- `NODE_ENV` = `production`
- `PORT` = (Render sets this automatically)

### 2.3 Wait for Deployment
- Render will build and deploy your backend
- You'll get a URL like: `https://real-estate-backend.onrender.com`
- **Save this URL** - you'll need it for frontend!

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Update Frontend API URL

Before deploying, update your frontend to use the Render backend URL:

**File:** `frontend/src/services/api.js`

Change the base URL to your Render backend URL:
```javascript
const API_BASE_URL = 'https://real-estate-backend.onrender.com/api';
```

Commit this change:
```bash
git add frontend/src/services/api.js
git commit -m "Update API URL for production"
git push
```

### 3.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure project:

**Settings:**
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

5. Click **"Deploy"**

### 3.3 Wait for Deployment
- Vercel will build and deploy your frontend
- You'll get a URL like: `https://real-estate-ml-project.vercel.app`
- Your app is now live! 🎉

---

## Step 4: Update Backend CORS (Important!)

After getting your Vercel URL, update backend CORS to allow your frontend:

**File:** `backend/server.js`

Update the CORS configuration:
```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://real-estate-ml-project.vercel.app'  // Add your Vercel URL
    ]
}));
```

Commit and push:
```bash
git add backend/server.js
git commit -m "Update CORS for production frontend"
git push
```

Render will automatically redeploy your backend.

---

## 📝 Important Notes

### Python ML Files Location
Your Node.js backend calls Python scripts from the `ml/` folder. Make sure:
- Python is available on Render (it is by default)
- The ML folder is accessible from backend
- Model files (`.pkl`) are in the repository

### Free Tier Limitations
- **Render Free Tier:** 
  - Spins down after 15 minutes of inactivity
  - First request after spin-down takes 30-60 seconds
  - 750 hours/month free

- **Vercel Free Tier:**
  - Always on
  - 100 GB bandwidth/month
  - Excellent performance

### Custom Domain (Optional)
Both Render and Vercel support custom domains in free tier:
- **Vercel:** Settings → Domains
- **Render:** Settings → Custom Domain

---

## 🔧 Troubleshooting

### Backend won't start on Render
- Check build logs for Python package installation errors
- Ensure `requirements.txt` path is correct in build command
- Verify Node.js version compatibility

### Frontend can't connect to backend
- Check CORS settings in `backend/server.js`
- Verify API URL in `frontend/src/services/api.js`
- Check browser console for errors

### Python ML script errors
- Ensure all `.pkl` model files are committed to Git
- Check Python version on Render (use `python --version` in logs)
- Verify CSV data file is included

---

## 🎯 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Backend URL saved
- [ ] Frontend API URL updated
- [ ] Frontend deployed on Vercel
- [ ] CORS updated with Vercel URL
- [ ] Test the live application
- [ ] Set up custom domain (optional)

---

## 🌐 Your Live URLs

After deployment, save your URLs:

- **Frontend:** `https://______.vercel.app`
- **Backend:** `https://______.onrender.com`
- **API:** `https://______.onrender.com/api`

---

## Need Help?

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- Check deployment logs for specific error messages
