# AI Shield Deployment Guide

## Prerequisites

### System Requirements
- Ubuntu 20.04+ / CentOS 8+
- 4GB RAM minimum, 8GB recommended
- 20GB disk space minimum
- Docker 20.10+
- Docker Compose 2.0+

### Required Services (External)
- PostgreSQL 15 (or use RDS, Heroku Postgres, etc.)
- Redis 7 (or use ElastiCache, Memorystore, etc.)
- SMTP Server (Gmail, SendGrid, AWS SES, etc.)
- Stripe Account (for payments)
- External APIs (OpenAI, Google Cloud, etc.)

## Deployment Steps

### 1. Prepare Server

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2. Clone Repository

```bash
# Create application directory
mkdir -p /opt/ai-shield
cd /opt/ai-shield

# Clone repository
git clone https://github.com/yourusername/ai-shield.git .
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with production values
nano .env
```

Critical values to set:
```bash
ENV=production
DEBUG=false
SECRET_KEY=$(openssl rand -base64 32)
JWT_SECRET_KEY=$(openssl rand -base64 32)

# Database - use managed service in production
DATABASE_URL=postgresql://user:password@db-host:5432/ai_shield_db

# Redis - use managed service
REDIS_URL=redis://cache-host:6379/0
CELERY_BROKER_URL=redis://cache-host:6379/1

# APIs
OPENAI_API_KEY=sk-...
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_USER=noreply@aishield.io
SMTP_PASSWORD=your-app-password

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### 4. Setup Database

```bash
# Create PostgreSQL database
createdb -h db-host -U postgres ai_shield_db

# Or use managed service and update DATABASE_URL in .env

# Run migrations
docker-compose run backend python -m alembic upgrade head

# Seed initial data (optional)
docker-compose run backend python -m app.db.init_db
```

### 5. Start Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f celery_worker
docker-compose logs -f frontend
```

### 6. Verify Installation

```bash
# Health check
curl http://localhost:8000/health

# API documentation
curl http://localhost:8000/docs

# Frontend
open http://localhost:3000
```

## Production Deployment Options

### AWS Deployment

#### Using ECS Fargate

1. Push Docker images to ECR:
```bash
aws ecr create-repository --repository-name ai-shield-backend --region us-east-1
aws ecr create-repository --repository-name ai-shield-frontend --region us-east-1

./docker/push-to-ecr.sh
```

2. Create ECS task definitions for backend, worker, frontend

3. Create Application Load Balancer (ALB)

4. Create RDS PostgreSQL instance

5. Create ElastiCache Redis cluster

6. Create ECS service with auto-scaling

#### Using AWS App Runner
```bash
aws apprunner create-service \
  --service-name ai-shield \
  --source-configuration repositoryType=GITHUB,imageRepository=...
```

### DigitalOcean Deployment

```bash
# Using App Platform
doctl apps create --spec app.yaml

# Using Droplets
doctl compute droplet create ai-shield-prod \
  --region nyc3 \
  --size s-2vcpu-4gb \
  --image docker-20-04 \
  --enable-monitoring
```

### Railway.app Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Heroku Deployment

```bash
# Create app
heroku create ai-shield-prod

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0 -a ai-shield-prod

# Add Redis addon
heroku addons:create heroku-redis:premium-0 -a ai-shield-prod

# Deploy
git push heroku main

# Run migrations
heroku run python -m alembic upgrade head -a ai-shield-prod
```

## SSL/TLS Configuration

### Let's Encrypt with Nginx

```bash
# Install Nginx
sudo apt-get install nginx certbot python3-certbot-nginx

# Configure SSL
sudo certbot certonly --nginx -d aishield.io -d www.aishield.io

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Docker Nginx Reverse Proxy

```docker
FROM nginx:alpine
COPY docker/nginx.conf:/etc/nginx/nginx.conf
EXPOSE 80 443
```

## Monitoring & Logging

### Application Monitoring
```bash
# View application logs
docker-compose logs -f backend

# Use Sentry for error tracking
# Set SENTRY_DSN in .env
```

### Database Monitoring
```bash
# Connect to PostgreSQL
psql -h db-host -U ai_shield -d ai_shield_db

# Check disk usage
\l

# Check active connections
SELECT * FROM pg_stat_activity;
```

### Redis Monitoring
```bash
# Redis CLI
redis-cli -h cache-host

# Check memory usage
INFO memory

# Monitor commands
MONITOR
```

### Celery Monitoring
```bash
# Flower UI
docker-compose up flower

# Access at http://localhost:5555
```

## Backup & Recovery

### Database Backup

```bash
# Automated daily backup
0 2 * * * /usr/local/bin/backup-db.sh

#!/bin/bash
BACKUP_DIR=/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | \
  gzip > $BACKUP_DIR/ai_shield_$TIMESTAMP.sql.gz

# Keep last 30 days
find $BACKUP_DIR -name "ai_shield_*.sql.gz" -mtime +30 -delete
```

### Database Restore

```bash
gunzip < backup.sql.gz | psql -h host -U user -d database
```

### Upload to S3

```bash
aws s3 cp backups/ s3://your-backup-bucket/ --recursive
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use AWS ALB, Google Cloud LB, or Nginx
2. **Multiple Backend Instances**: Run multiple FastAPI containers
3. **Multiple Worker Instances**: Scale Celery workers based on queue depth
4. **Database Replication**: PostgreSQL replicas for read scaling
5. **Redis Cluster**: Redis Cluster for distributed caching

### Vertical Scaling

1. Increase container resource limits in docker-compose.yml
2. Upgrade RDS instance type
3. Upgrade Redis instance type
4. Monitor CPU, memory, storage

### Performance Optimization

```bash
# Enable query caching
REDIS_URL=redis://cache:6379/0

# Database indexing
CREATE INDEX idx_scan_status ON scans(status);
CREATE INDEX idx_result_severity ON scan_results(severity);

# Connection pooling
SQLALCHEMY_POOL_SIZE=20
SQLALCHEMY_MAX_OVERFLOW=40
```

## Troubleshooting

### Backend won't start
```bash
docker-compose logs backend
docker-compose exec backend python -m app.main
```

### Database connection error
```bash
# Test connection
psql -h host -U user -d database

# Check DATABASE_URL format
# postgresql://user:password@host:port/database
```

### Worker not processing tasks
```bash
docker-compose logs celery_worker
docker-compose restart celery_worker
```

### High memory usage
```bash
# Reduce CELERY_WORKER_CONCURRENCY
# Check for memory leaks with memory-profiler
# Restart containers regularly
```

### API slow responses
```bash
# Check database query performance
# Enable Redis caching
# Add database indexes
# Monitor worker queue depth
```

## Security Checklist

- [ ] Change all default credentials
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up VPN for admin access
- [ ] Enable database encryption
- [ ] Enable Redis encryption
- [ ] Configure security headers (CORS, CSP)
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Implement WAF (AWS WAF, Cloudflare)
- [ ] Set up DDoS protection
- [ ] Database backups encrypted and off-site
- [ ] Secrets in vault (AWS Secrets Manager, Vault)
- [ ] Regular penetration testing

## Maintenance

### Regular Updates

```bash
# Update dependencies
cd backend && pip install --upgrade -r requirements.txt
cd frontend && npm update

# Update Docker images
docker-compose pull
docker-compose up -d
```

### Database Maintenance

```bash
# Weekly vacuum & analyze
VACUUM ANALYZE;

# Monthly maintenance
REINDEX DATABASE ai_shield_db;
```

### Monitoring & Alerts

Set up alerts for:
- CPU > 80%
- Memory > 85%
- Disk space < 10%
- Database connections > 90%
- Queue depth > 1000
- API error rate > 5%
- API response time > 2s

## Support

For deployment issues:
1. Check logs: `docker-compose logs service-name`
2. Verify environment variables
3. Test database connectivity
4. Check service health endpoints
5. Contact support@aishield.io
