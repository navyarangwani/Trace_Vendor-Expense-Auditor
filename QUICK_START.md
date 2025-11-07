# 🚀 Quick Start Guide

## Current Status

✅ **Backend**: Should be running on http://localhost:8000
✅ **Frontend**: Should be starting on http://localhost:5173

## Verify Everything is Running

### 1. Check Backend
Open in browser: http://localhost:8000/docs
- You should see the FastAPI documentation page
- If not, backend might not be running

### 2. Check Frontend  
Open in browser: http://localhost:5173
- You should see the Trace application interface
- If you see a blank page or errors, check the browser console (F12)

## If Servers Aren't Running

### Start Backend Manually:
```powershell
cd backend
uvicorn app.main:app --reload
```

### Start Frontend Manually:
```powershell
cd frontend
npm run dev
```

## Test the Application

1. Go to http://localhost:5173
2. Click "Select CSV File"
3. Choose: `sample_data/invoices_sample.csv`
4. Click "Upload & Analyze"
5. View the dashboard with detected anomalies!

## Troubleshooting

### Backend not starting?
- Make sure port 8000 is not in use
- Check if Python dependencies are installed: `pip install -r backend/requirements.txt`

### Frontend not starting?
- Make sure port 5173 is not in use
- Try: `cd frontend && npm install --legacy-peer-deps && npm run dev`
- Check for errors in the terminal

### CORS errors?
- Backend CORS is configured for localhost:5173
- Make sure backend is running before frontend tries to connect

## Ports Used
- **Backend**: 8000
- **Frontend**: 5173

