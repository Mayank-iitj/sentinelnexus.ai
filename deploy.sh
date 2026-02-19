#!/bin/bash
set -e

echo "🚀 AI Shield Deployment Script"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not installed${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"

# Check environment file
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env with your configuration${NC}"
    exit 1
fi

# Stop existing services
echo -e "${YELLOW}Stopping existing services...${NC}"
docker-compose down

# Build images
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose build

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose up -d

# Wait for database
echo -e "${YELLOW}Waiting for database...${NC}"
sleep 10

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose exec -T backend python -m alembic upgrade head

# Seed initial data
echo -e "${YELLOW}Seeding initial data...${NC}"
docker-compose exec -T backend python -m app.db.init_db

# Check health
echo -e "${YELLOW}Checking service health...${NC}"
HEALTH_CHECK=$(curl -s http://localhost:8000/health)

if [[ $HEALTH_CHECK == *"healthy"* ]]; then
    echo -e "${GREEN}✓ API healthy${NC}"
else
    echo -e "${RED}✗ API health check failed${NC}"
    exit 1
fi

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ AI Shield deployed successfully!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Access points:"
echo "  Frontend: http://localhost:3000"
echo "  API: http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
