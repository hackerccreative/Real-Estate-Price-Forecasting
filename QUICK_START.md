# 🚀 Quick Deployment Steps

## ✅ Use Single Repository (Monorepo)
**Answer: Push everything in ONE repository**

```
your-repo/
├── backend/          → Deploy on Render
├── frontend/         → Deploy on Vercel  
├── ml/              → Used by backend
├── requirements.txt
└── README.md
```

---

## 📦 Step-by-Step (5 minutes)

### 1️⃣ Push to GitHub (2 min)
```bash
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/your-repo.git
git push -u origin main
```

### 2️⃣ Deploy Backend on Render (2 min)
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. **Root Directory:** `backend`
4. **Build Command:** `npm install && pip install -r ../ml/requirements.txt`
5. **Start Command:** `node server.js`
6. Deploy! → Save the URL: `https://______.onrender.com`

### 3️⃣ Deploy Frontend on Vercel (1 min)
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. **Root Directory:** `frontend`
4. **Framework:** Vite (auto-detected)
5. Deploy! → Your site is live! 🎉

### 4️⃣ Connect Frontend to Backend
Update `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend.onrender.com/api';
```
Then:
```bash
git add .
git commit -m "Update API URL"
git push
```
Vercel will auto-redeploy!

---

## 🎯 Done!
- Frontend: `https://______.vercel.app`
- Backend: `https://______.onrender.com`

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.
