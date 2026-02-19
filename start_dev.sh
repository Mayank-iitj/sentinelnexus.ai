#!/bin/bash
# Development server startup script

set -e

echo "🚀 Starting AI Shield Development Servers"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo "Please edit .env with your configuration"
    exit 1
fi

# Start in background
echo -e "${GREEN}Starting services...${NC}"
echo ""

# Backend
echo "📡 Starting FastAPI backend on port 8000..."
cd backend
python run.py &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Give backend time to start
sleep 3

# Worker (optional)
if [ "$START_WORKER" = "true" ]; then
    echo "👷 Starting Celery worker..."
    celery -A app.tasks worker --loglevel=info &
    WORKER_PID=$!
    echo -e "${GREEN}✓ Worker started (PID: $WORKER_PID)${NC}"
fi

# Frontend
cd ../frontend
echo "🎨 Starting Next.js frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

cd ..

echo ""
echo -e "${GREEN}✨ All services started!${NC}"
echo ""
echo "Access points:"
echo "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo "  Backend:  ${GREEN}http://localhost:8000${NC}"
echo "  API Docs: ${GREEN}http://localhost:8000/docs${NC}"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID $WORKER_PID 2>/dev/null; echo 'Servers stopped'" EXIT

# Wait for processes
wait
