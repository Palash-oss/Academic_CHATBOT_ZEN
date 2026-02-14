@echo off
REM Healthcare AI Bot - Windows Startup Script

echo Starting Healthcare AI Bot...
echo ==========================================

REM Start backend
echo [1/2] Starting Backend (Flask) on port 8080...
cd backend
start "Healthcare-Bot-Backend" python app.py
timeout /t 3 /nobreak

REM Start frontend
echo [2/2] Starting Frontend (React) on port 3000...
cd ..\frontend
call npm run dev

echo.
echo ==========================================
echo To stop the application, close both windows
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080
