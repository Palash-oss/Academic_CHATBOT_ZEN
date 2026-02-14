# Quick Start Guide

## One-Time Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Environment Variables
Create `.env` in repo root:
```
PINECONE_API_KEY=your_key_here
```

### 4. Build Pinecone Index (one time)
```bash
python backend/store_index.py
```

## Running the App

### Option A: Using Startup Scripts

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
bash start.sh
```

### Option B: Manual Terminal Tabs

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Features Working Location

- **Chat**: Type in chat box → communicates with backend `/api/chat`
- **Hospitals Map**: Click "Get My Location" → calls `/api/nearby-hospitals`
- **Language**: Select EN/HI/OR dropdown (fully functional)
- **Smooth Scrolling**: Click nav items → smooth scroll to sections

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Change in `frontend/vite.config.js` → `port: 3001` |
| Port 8080 already in use | Change in `backend/app.py`  → `port=5000` |
| "Cannot find module 'X'" | Run `npm install` in frontend or `pip install -r requirements.txt` in backend |
| Chat not working | Ensure backend running on 8080 + check browser console for errors |
| CORS error | Backend has CORS enabled, restart both if persists |
| Map not showing | Need internet connection for OpenStreetMap tiles |

## Key Files Modified

- **React Components**: `frontend/src/components/*.jsx`
- **React CSS**: `frontend/src/styles/modern_style.css` (unchanged UI)
- **Backend**: `backend/app.py` (CORS enabled)
- **API Calls**: Using `http://localhost:8080/api/*`

## All Same UI - Tech Stack Changed

✅ Same visual layout and styling
✅ Same color scheme (green theme)
✅ Same functionality (chat, hospitals, features)
✅ Same languages (EN/HI/OR)
✅ Tech: HTML/CSS → **React** | Vanilla JS → **React Hooks**
✅ Both ports separate (frontend 3000, backend 8080)
✅ Clean code architecture with components
✅ Zero breaking changes to backend API
