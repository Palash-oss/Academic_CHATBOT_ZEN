#!/bin/bash
# Healthcare AI Bot - Startup Script

echo "Starting Healthcare AI Bot..."
echo "=========================================="

# Start backend in background
echo "[1/2] Starting Backend (Flask) on port 8080..."
cd backend
python app.py &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Give backend a moment to start
sleep 3

# Start frontend
echo "[2/2] Starting Frontend (React) on port 3000..."
cd ../frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
