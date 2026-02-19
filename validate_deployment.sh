#!/bin/bash
# Production deployment validation script

set -e

echo "🔍 Validating production deployment..."
echo "======================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CHECKS_PASSED=0
CHECKS_FAILED=0

check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((CHECKS_FAILED++))
    fi
}

# Environment
echo "Environment Checks:"
[ -f .env ] && echo -e "${GREEN}✓${NC} .env file exists" || (echo -e "${RED}✗${NC} .env file missing"; exit 1)

# Docker
docker --version > /dev/null 2>&1
check "Docker installed"

docker-compose --version > /dev/null 2>&1
check "Docker Compose installed"

# Files
[ -f docker-compose.yml ]
check "docker-compose.yml exists"

[ -f backend/requirements.txt ]
check "Backend requirements.txt exists"

[ -f frontend/package.json ]
check "Frontend package.json exists"

# Database
[ -f backend/alembic/versions/001_initial_migration.py ]
check "Database migrations exist"

# Documentation
[ -f README.md ]
check "README.md exists"

[ -f DEPLOYMENT.md ]
check "DEPLOYMENT.md exists"

[ -f API_REFERENCE.md ]
check "API_REFERENCE.md exists"

# Configuration
[ -f backend/app/core/config.py ]
check "Backend configuration exists"

# Tests
[ -d backend/tests ]
check "Tests directory exists"

# Summary
echo ""
echo "======================================="
echo "Results: ${GREEN}$CHECKS_PASSED passed${NC}, ${RED}$CHECKS_FAILED failed${NC}"
echo "======================================="

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Ready for deployment. Run:"
    echo "  docker-compose up -d"
    exit 0
else
    echo -e "${RED}✗ Some checks failed!${NC}"
    exit 1
fi
