# Real Estate Price Prediction - Node.js + Python Backend

This project has been refactored to use a **Node.js (Express)** server as the main entry point, which communicates with a **Python** script for Machine Learning predictions.

## Project Structure

```
backend/           # Node.js Server
  ├── server.js    # Entry point
  ├── package.json
  ├── routes/      # API Routes
  ├── controllers/ # Logic (spawns Python process)
ml/                # Python ML Logic
  ├── predict.py   # CLI script for prediction
  ├── *.pkl        # Trained models
  ├── *.csv        # Data files
  ├── requirements.txt
frontend/          # React Frontend (Vite)
```

## Prerequisites

- **Node.js** (v18+)
- **Python** (v3.8+)
- **pip** (Python package manager)

## Setup & Running Locally

### 1. Setup Python Environment (ML)

Navigate to the `ml` folder and install dependencies.

```bash
cd ml
pip install -r requirements.txt
# If you encounter issues with 'fastapi' or 'uvicorn' in existing requirements, 
# you can ignore them or remove them, as we only need: 
# pandas, numpy, scikit-learn, joblib
```

### 2. Setup Node.js Backend

Navigate to the `backend` folder and install dependencies.

```bash
cd ../backend
npm install
```

### 3. Run the Backend Server

```bash
npm start
# Server runs on http://localhost:5000
```

### 4. Update Frontend Configuration

To connect the existing frontend to the new backend:
1. Open `frontend/vite.config.js`.
2. Update the `proxy` settings:
   - Change `target` to `http://localhost:5000`.
   - **Remove** the `rewrite` line so that requests include the `/api` prefix.

Example `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

## API Endpoints

### POST `/api/predict`
Predicts real estate price trends.

**Input (JSON):**
```json
{
  "locality": "Indira Nagar",
  "model_type": "linear"
}
```

**Output (JSON):**
```json
{
  "historical_data": [...],
  "predicted_data": [...],
  "model_used": "Linear"
}
```

### GET `/api/localities`
Returns list of available localities.

## Deployment on Render

To deploy this hybrid Node.js + Python application on Render:

1.  **Create a `render.yaml`** or use **Docker**. Docker is recommended for precise control over both Node and Python environments.

2.  **Create a `Dockerfile`** in the project root:

    ```dockerfile
    FROM node:18-slim

    # Install Python and pip
    RUN apt-get update && apt-get install -y python3 python3-pip

    # Create app directory
    WORKDIR /app

    # Copy ML files and install Python deps
    COPY ml/ ./ml/
    RUN pip3 install -r ml/requirements.txt --break-system-packages

    # Copy Backend files and install Node deps
    COPY backend/ ./backend/
    WORKDIR /app/backend
    RUN npm install

    # Expose port
    EXPOSE 5000

    # Start command
    CMD ["npm", "start"]
    ```

3.  **Deploy:**
    - Push your code to GitHub.
    - Create a new **Web Service** on Render.
    - Select "Docker" as the environment.
    - Connect your repository.

## Deployment on Netlify (Frontend)

1.  Build the frontend: `cd frontend && npm run build`.
2.  Deploy the `frontend/dist` folder to Netlify.
3.  Configure a `_redirects` file in `public` or build settings to proxy `/api/*` to your Render backend URL.