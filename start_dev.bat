@echo off
setlocal
title AI Shield Launcher

echo ==========================================
echo    AI S H I E L D   D E V   S E R V E R
echo ==========================================
echo.

:: Check .env
if not exist .env (
    echo [WARN] .env file not found in root.
    if exist .env.example (
        echo [INFO] Creating .env from .env.example...
        copy .env.example .env >nul
    ) else (
        echo [ERROR] .env.example also missing!
        pause
        exit /b 1
    )
)

:: Start Backend
echo [1/2] Starting Backend Server...
start "AI Shield Backend (Port 8000)" cmd /k "cd backend && python run.py"

:: Wait a bit for backend to init
timeout /t 3 /nobreak >nul

:: Start Frontend
echo [2/2] Starting Frontend Server...
start "AI Shield Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo    S E R V I C E S   L A U N C H E D
echo ==========================================
echo.
echo  - Frontend: http://localhost:3000
echo  - Backend:  http://localhost:8000
echo  - API Docs: http://localhost:8000/docs
echo.
echo Close the popup windows to stop the servers.
echo.
pause
