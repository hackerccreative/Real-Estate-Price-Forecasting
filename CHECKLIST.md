# ✅ Pre-Deployment Checklist

## Files Ready ✓
- [x] `requirements.txt` with versions
- [x] `.gitignore` updated
- [x] Python controllers fixed for cross-platform
- [x] `render.yaml` blueprint created
- [x] `vercel.json` configuration created
- [x] Deployment guides created

## Before You Push to GitHub

### 1. Check ML Model Files
Make sure these files exist in `ml/` folder:
- [ ] `lin_model.pkl`
- [ ] `poly_model.pkl`
- [ ] `Lucknow_RealEstate_Price.csv`

If missing, run from `ml/` folder:
```bash
cd ml
python retrain_models.py
```

### 2. Test Locally
```bash
# Terminal 1 - Backend
cd backend
npm install
node server.js

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173 and test predictions

### 3. Verify Git Status
```bash
git status
```
Should show:
- Modified: backend controllers, .gitignore
- New files: DEPLOYMENT_GUIDE.md, render.yaml, etc.

---

## Push to GitHub

```bash
# Add all changes
git add .

# Commit
git commit -m "Prepare for Render and Vercel deployment"

# If you haven't created the repo yet:
# 1. Go to github.com → New Repository
# 2. Name it (e.g., real-estate-ml-project)
# 3. Don't initialize with README
# 4. Copy the repo URL

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push
git push -u origin main
```

**If error says "main" doesn't exist, use:**
```bash
git branch -M main
git push -u origin main
```

---

## Deploy Steps

### Render (Backend)
1. ✓ Sign up at render.com
2. ✓ New Web Service
3. ✓ Connect GitHub
4. ✓ Select repository
5. ✓ Root Dir: `backend`
6. ✓ Build: `npm install && pip install -r ../ml/requirements.txt`
7. ✓ Start: `node server.js`
8. ✓ Create Web Service
9. ✓ Wait ~3 minutes
10. ✓ Copy URL: `https://______.onrender.com`

### Vercel (Frontend)
1. ✓ Sign up at vercel.com
2. ✓ New Project
3. ✓ Import GitHub repo
4. ✓ Root Dir: `frontend`
5. ✓ Framework: Vite (auto-detected)
6. ✓ Deploy
7. ✓ Wait ~1 minute
8. ✓ Your site is live!

### Connect Them
1. ✓ Update `frontend/src/services/api.js`
2. ✓ Change API URL to your Render URL
3. ✓ `git commit` and `git push`
4. ✓ Vercel auto-redeploys

---

## Test Production

Visit your Vercel URL:
- [ ] Page loads
- [ ] Can select locality
- [ ] Predictions work
- [ ] No CORS errors in console

---

## Troubleshooting

### Backend not starting on Render?
- Check build logs
- Verify Python packages installed
- Check "Logs" tab for errors

### Frontend can't reach backend?
- Check API URL in `services/api.js`
- Add Vercel URL to CORS in `backend/server.js`
- Check browser console for errors

### Python errors?
- Ensure `.pkl` files are in repository
- Check Python version in Render logs
- Verify CSV file exists

---

## 🎉 Success!

Your app is deployed on:
- **Frontend:** https://______.vercel.app
- **Backend:** https://______.onrender.com

Share your live link! 🚀
