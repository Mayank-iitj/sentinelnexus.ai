# AI Shield PowerShell Launcher
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   AI S H I E L D   D E V   S E R V E R   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check .env file
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "[INFO] Creating .env from .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
    } else {
        Write-Host "[ERROR] .env and .env.example are missing!" -ForegroundColor Red
        exit 1
    }
}

# Start Backend
Write-Host "[1/2] Starting Backend Server (Uvicorn)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python run.py" -WindowStyle Normal

# Wait for backend initialization
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[2/2] Starting Frontend Server (Next.js)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   S E R V I C E S   L A U N C H E D      " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "  - Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "  - API Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Close the terminal windows to stop the servers."
Write-Host ""
Read-Host "Press Enter to exit this launcher..."
