# AI Shield - Production Runbook

## 📋 Table of Contents

1. [Pre-Deployment](#pre-deployment)
2. [Deployment Steps](#deployment-steps)
3. [Verification](#verification)
4. [Monitoring](#monitoring)
5. [Troubleshooting](#troubleshooting)
6. [Rollback Procedures](#rollback-procedures)
7. [Maintenance](#maintenance)

---

## Pre-Deployment

### Requirements Checklist

- [ ] All code merged to main branch
- [ ] Tests passing (pytest, coverage >70%)
- [ ] CI/CD pipeline green
- [ ] Security scanning complete
- [ ] Database backups configured
- [ ] Environment variables set
- [ ] SSL certificates valid
- [ ] Monitoring configured
- [ ] On-call team notified
- [ ] Maintenance window communicated

### Pre-Flight Checks

```bash
# Verify all services can start locally
docker-compose up

# Run production readiness check
python verify_production_ready.py

# Validate all tests pass
cd backend && pytest tests/ --cov=app

# Check environment variables
grep -c "=" .env
```

---

## Deployment Steps

### 1. Database Backup

```bash
# Create backup
docker-compose exec -T db pg_dump -U postgres aishield > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
ls -lh backup_*.sql

# Upload to S3
aws s3 cp backup_*.sql s3://aishield-backups/
```

### 2. Build Docker Images

```bash
# Build images
docker-compose build --no-cache

# Tag images
docker tag aishield_backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/aishield-backend:latest
docker tag aishield_frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/aishield-frontend:latest
docker tag aishield_worker:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/aishield-worker:latest

# Push to registry
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/aishield-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/aishield-frontend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/aishield-worker:latest
```

### 3. Pull Latest Images

```bash
# On production server
docker-compose pull

# Verify images
docker images | grep aishield
```

### 4. Run Database Migrations

```bash
# Apply migrations
docker-compose exec -T backend alembic upgrade head

# Verify migrations
docker-compose exec -T db psql -U postgres -c "SELECT * FROM alembic_version;"
```

### 5. Start Services

```bash
# Stop old services
docker-compose down

# Start new services
docker-compose up -d

# Wait for services to be ready
sleep 10

# Check logs
docker-compose logs -f
```

### 6. Smoke Tests

```bash
# Test API health
curl -X GET http://localhost:8000/health | jq .

# Test database connection
curl -X GET http://localhost:8000/api/v1/health | jq .

# Test frontend availability
curl -s http://localhost:3000 > /dev/null && echo "Frontend OK"

# Run basic API test
./scripts/smoke_tests.sh
```

### 7. Notify Users

```bash
# Post status update
curl -X POST https://status.aishield.io/api/incidents \
  -H "Authorization: Bearer $STATUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Deployment complete",
    "status": "resolved",
    "impact": "none"
  }'
```

---

## Verification

### Automated Verification

```bash
# Health check script
#!/bin/bash
ENDPOINTS=(
  "http://localhost:8000/health"
  "http://localhost:3000"
  "http://localhost:8000/api/v1/auth/me"
)

for endpoint in "${ENDPOINTS[@]}"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" $endpoint)
  if [ $response -eq 200 ]; then
    echo "✓ $endpoint - OK"
  else
    echo "✗ $endpoint - Error (HTTP $response)"
    exit 1
  fi
done
```

### Manual Verification

**API Endpoints**
```bash
# Authentication
POST /api/v1/auth/login
   Response: UUID, access_token, refresh_token

GET /api/v1/auth/me
   Response: User details

# Projects
GET /api/v1/projects
   Response: List of projects

POST /api/v1/scans/code
   Response: Scan is accepted and running
```

**Database**
```bash
# Check connection
docker-compose exec db psql -U postgres -l

# Sample queries
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM organizations;
SELECT COUNT(*) FROM scans;
```

**Services**
```bash
# Check all containers running
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs worker
docker-compose logs frontend
```

---

## Monitoring

### Key Metrics

**CPU & Memory**
```bash
docker stats
```

**Database**
```bash
# Connections
SELECT count(*) FROM pg_stat_activity;

# Slow queries
SELECT query, calls, mean_exec_time FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;
```

**API Performance**
```bash
# Endpoint response times
curl -w "Time: %{time_total}s\n" http://localhost:8000/api/v1/auth/me
```

**Redis**
```bash
# Memory usage
docker-compose exec redis redis-cli INFO memory

# Connected clients
docker-compose exec redis redis-cli INFO clients
```

### Alerting

Configure alerts for:
- Service down (any container not running)
- High CPU (>80% for 5 minutes)
- High memory (>85% for 5 minutes)
- Database connection failures
- Scan failures (>5% error rate)
- API response times (>500ms p95)

### Dashboards

- **Main Dashboard**: Overall system health
- **API Dashboard**: Endpoint performance
- **Database Dashboard**: Query performance
- **Celery Dashboard**: Task queue status
- **Frontend Dashboard**: Page load times

---

## Troubleshooting

### Service Down

```bash
# Check if containers are running
docker-compose ps

# Restart service
docker-compose restart backend

# Check logs
docker-compose logs -f backend --tail 100

# Full restart if needed
docker-compose down && docker-compose up -d
```

### Database Connection Error

```bash
# Check database status
docker-compose logs db

# Check connection string in .env
grep DATABASE_URL .env

# Manual connection test
docker-compose exec db psql -U postgres -c "SELECT 1"

# Restart database
docker-compose restart db

# Restore from backup if corrupted
psql -U postgres < backup_TIMESTAMP.sql
```

### High Memory Usage

```bash
# Check memory per service
docker stats

# Identify memory leaks
docker-compose logs backend | grep -i memory

# Restart specific service
docker-compose restart backend

# Increase memory limit in docker-compose.yml if needed
```

### Slow API Responses

```bash
# Check database queries
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC;

# Check API logs
docker-compose logs backend | grep "duration"

# Check server resources
docker stats

# Look for slow endpoints
curl -v http://localhost:8000/api/v1/endpoints/slow
```

### Task Queue Issues

```bash
# Check Celery worker status
docker-compose logs worker

# Monitor task queue
docker-compose exec redis redis-cli LLEN celery

# Clear stuck tasks
docker-compose exec redis redis-cli FLUSHDB

# Restart worker
docker-compose restart worker
```

---

## Rollback Procedures

### Quick Rollback (< 5 minutes)

```bash
# Keep previous version tagged
docker tag aishield_backend:current aishield_backend:previous
docker tag aishield_backend:new aishield_backend:current

# If issues, revert
docker tag aishield_backend:previous aishield_backend:current

# Restart services
docker-compose restart backend
```

### Full Rollback (with database)

```bash
# 1. Stop services
docker-compose down

# 2. Restore database from backup
docker-compose up -d db
sleep 5
psql -U postgres < backup_PREVIOUS.sql

# 3. Checkout previous code
git checkout previous-tag

# 4. Rebuild and start
docker-compose build
docker-compose up -d

# 5. Run migrations for previous version
docker-compose exec -T backend alembic downgrade -1

# 6. Verify
curl http://localhost:8000/health
```

### Communication During Rollback

```bash
# Post incident update
curl -X POST https://status.aishield.io/api/incidents \
  -H "Authorization: Bearer $STATUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Issue detected, rolling back deployment",
    "status": "investigating",
    "impact": "partial"
  }'

# Send Slack notification
curl -X POST $SLACK_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "text": "🔄 Rolling back deployment to previous version",
    "attachments": [{
      "color": "warning",
      "title": "Rollback in progress"
    }]
  }'
```

---

## Maintenance

### Daily Tasks

```bash
# 7 AM: Check all services
docker-compose ps
docker stats

# Monitor alerts
# - Check CloudWatch
# - Review error logs
# - Check database size

# End of day: Document any issues
```

### Weekly Tasks

```bash
# Monday: Review metrics
# - Request/response times
# - Error rates
# - Resource usage

# Wednesday: Backup verification
# - Test backup restore
# - Verify S3 uploads

# Friday: Performance review
# - Slow query analysis
# - Cache hit rates
```

### Monthly Tasks

```bash
# Update dependencies
cd backend && pip list --outdated
cd frontend && npm outdated

# Security scanning
# - Vulnerability scanning
# - Dependency audits

# Performance optimization
# - Database optimization
# - Cache tuning

# Capacity planning
# - Growth projection
# - Scaling readiness
```

### Quarterly Tasks

```bash
# Full security audit
# - Penetration testing
# - Code review
# - Infrastructure review

# Disaster recovery drill
# - Test backup restoration
# - Practice failover
# - Time recovery procedures

# Architecture review
# - Technology updates
# - Performance improvements
# - Cost optimization
```

---

## Emergency Contacts

- **On-call Engineer**: [phone/pager]
- **DevOps Lead**: [contact]
- **Security Team**: [contact]
- **Database Admin**: [contact]

## Status Page

- **Public Status**: https://status.aishield.io
- **Internal Dashboard**: https://monitoring.aishield.io
- **Incident Channel**: #incidents on Slack
- **War Room**: [Zoom/Teams link]

---

## Sign-off

**Deployed By**: _________________ **Date**: _______
**Verified By**: _________________ **Time**: _______
**All Checks Pass**: ☐ YES ☐ NO

---

**Rev 1.0** | Last Updated: 2024-01-20
