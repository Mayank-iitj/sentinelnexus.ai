# AI Shield - Environment Configuration Guide

## Setting Up Your .env File

The `.env.example` file contains all configurable options. Copy it to `.env` and customize.

```bash
cp .env.example .env
```

---

## 🔧 Configuration Reference

### Application Settings

```env
# Application
APP_NAME=AI Shield
APP_VERSION=1.0.0
DEBUG=False                    # Set to True for development
ENVIRONMENT=production         # or development/staging
HOST=0.0.0.0
PORT=8000
```

### Database Configuration

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/aishield

# Example for Docker:
DATABASE_URL=postgresql://postgres:postgres@db:5432/aishield

# Example for AWS RDS:
DATABASE_URL=postgresql://admin:password@aishield.xyz.us-east-1.rds.amazonaws.com:5432/aishield
```

### Redis Cache

```env
# Redis
REDIS_URL=redis://localhost:6379/0

# Example for Docker:
REDIS_URL=redis://redis:6379/0

# Example for Heroku:
REDIS_URL=redis://h:password@ec2-12-34-56-78.compute-1.amazonaws.com:12345/
```

### Authentication

```env
# JWT Configuration
SECRET_KEY=your-very-secure-secret-key-min-32-chars    # MUST be changed!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30
```

**Important**: Generate a secure key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### CORS Configuration

```env
# CORS - URLs that can access the API
CORS_ORIGINS=["http://localhost:3000", "http://localhost:8000", "https://yourdomain.com"]
```

### Email Configuration (SMTP)

```env
# Gmail (recommended for dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password    # NOT your Gmail password!
EMAILS_FROM_EMAIL=noreply@aishield.io
EMAILS_FROM_NAME=AI Shield

# SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxx

# AWS SES
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASSWORD=your-app-password
```

**Gmail Setup**:
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use generated password (not regular password)

### Slack Integration

```env
# Get webhook from: https://api.slack.com/messaging/webhooks
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Stripe Payment

```env
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx         # Secret key (for dev use test key)
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxx         # Publishable key
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx       # From Webhooks endpoint

# For production, use live keys (sk_live_, pk_live_, whsec_live_)
```

### Celery Configuration

```env
# Task Queue (usually same as Redis)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# For Docker:
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

### Rate Limiting

```env
# Rate limiting configuration
RATE_LIMIT_ENABLED=True
RATE_LIMIT_REQUESTS_PER_SECOND=50

# Per subscription tier:
# Free: 10 req/sec
# Pro: 50 req/sec
# Enterprise: 100 req/sec
```

### Logging

```env
# Logging configuration
LOG_LEVEL=INFO              # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_FORMAT=json             # json or text
```

### AWS S3 (Optional)

```env
# For storing scan reports and backups
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_BUCKET_NAME=aishield-reports
AWS_REGION=us-east-1
```

### Security Settings

```env
# HTTPS/SSL
SECURE_SSL_REDIRECT=False       # Set to True in production
SESSION_COOKIE_SECURE=False     # Set to True in production
CSRF_TRUSTED_ORIGINS=[]

# Allowed hosts
ALLOWED_HOSTS=["*"]             # Restrict in production
```

### Scanning Configuration

```env
# Scan limits
MAX_CODE_SIZE_MB=50
MAX_PROMPT_LENGTH=10000
MAX_SCAN_TIMEOUT_SECONDS=300
```

### Feature Flags

```env
# Enable/disable features
ENABLE_OAUTH=False
ENABLE_GITHUB_INTEGRATION=True
ENABLE_GITLAB_INTEGRATION=True
ENABLE_CUSTOM_POLICIES=True
```

---

## 📝 Environment Examples

### Local Development

```env
DEBUG=True
ENVIRONMENT=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aishield_dev
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=dev-secret-key-not-for-production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
LOG_LEVEL=DEBUG
```

### Docker Local

```env
DEBUG=False
ENVIRONMENT=development
DATABASE_URL=postgresql://postgres:postgres@db:5432/aishield
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your-generated-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Staging Deployment

```env
DEBUG=False
ENVIRONMENT=staging
DATABASE_URL=postgresql://admin:password@staging-db.example.com:5432/aishield
REDIS_URL=redis://staging-redis.example.com:6379/0
SECRET_KEY=your-generated-secret-key-staging
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### Production Deployment

```env
DEBUG=False
ENVIRONMENT=production
DATABASE_URL=postgresql://admin:SECURE_PASSWORD@prod-db.example.com:5432/aishield
REDIS_URL=redis://prod-redis.example.com:6379/0
SECRET_KEY=YOUR_VERY_SECURE_KEY_MIN_32_CHARS
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CORS_ORIGINS=["https://aishield.io", "https://app.aishield.io"]
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx        # LIVE key!
STRIPE_PUBLIC_KEY=pk_live_xxxxx        # LIVE key!
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
LOG_LEVEL=INFO
```

---

## 🔐 Security Best Practices

### 1. Secret Management

✅ **DO**:
- Use environment variables
- Generate strong keys: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- Store secrets in secure vaults
- Rotate secrets regularly
- Use different secrets per environment

❌ **DON'T**:
- Commit `.env` file to Git
- Use placeholder values in production
- Share secrets over email
- Reuse production keys in development
- Store secrets in code

### 2. Database Security

```env
# Use strong password
DATABASE_URL=postgresql://postgres:VERY_STRONG_PASSWORD@db:5432/aishield

# Enable SSL for remote connections
DATABASE_URL=postgresql://user:pass@remote-db.com:5432/db?sslmode=require
```

### 3. API Key Security

```env
# Stripe
- Use live keys in production only
- Rotate keys if compromised
- Use webhook signing for verification

# AWS
- Use IAM roles instead of root credentials
- Restrict permissions to minimum needed
- Enable key rotation
```

### 4. Email Security

```env
# Enable TLS/SSL
SMTP_PORT=587      # TLS
# or
SMTP_PORT=465      # SSL

# Use app-specific passwords (Gmail, Office 365)
# Don't use actual password in production
```

---

## 🚀 Verification

### Test Configuration

```bash
# Verify database connection
python -c "from sqlalchemy import create_engine; engine = create_engine(os.getenv('DATABASE_URL')); engine.connect()"

# Verify Redis connection
python -c "import redis; r = redis.Redis.from_url(os.getenv('REDIS_URL')); print(r.ping())"

# Verify SMTP connection
python -c "import smtplib; s = smtplib.SMTP(os.getenv('SMTP_HOST'), int(os.getenv('SMTP_PORT'))); s.starttls()"

# Verify Stripe
python -c "import stripe; stripe.api_key = os.getenv('STRIPE_SECRET_KEY'); print(stripe.Account.retrieve())"
```

### Check All Variables

```bash
# Count configured variables
grep -E "^[A-Z_]+=" .env | wc -l

# Find missing required variables
grep -E "^# Required" .env.example
```

---

## 📋 Configuration Checklist

### Development
- [ ] `.env` created from `.env.example`
- [ ] `SECRET_KEY` changed
- [ ] Database URL configured
- [ ] Redis URL configured
- [ ] SMTP configured (optional, for emails)
- [ ] `DEBUG=True`

### Staging
- [ ] `DEBUG=False`
- [ ] Production database configured
- [ ] Production Redis configured
- [ ] `SECURE_SSL_REDIRECT=True`
- [ ] `SESSION_COOKIE_SECURE=True`
- [ ] SMTP configured
- [ ] Stripe test keys configured
- [ ] AWS credentials (if using S3)

### Production
- [ ] All staging checks done
- [ ] `STRIPE_SECRET_KEY` uses **live** key
- [ ] Database backed up and tested
- [ ] Redis cluster configured
- [ ] DNS/domain configured
- [ ] SSL certificate installed
- [ ] Email domain verified
- [ ] Monitoring configured
- [ ] Secrets in secure vault
- [ ] Credentials NOT in Git

---

## 🆘 Troubleshooting

### "Can't connect to database"
```bash
# Check connection string
grep DATABASE_URL .env

# Verify database is running
docker-compose ps db

# Test connection
psql postgresql://user:pass@localhost:5432/aishield
```

### "Redis connection failed"
```bash
# Check Redis is running
docker-compose ps redis

# Test Redis
redis-cli -u redis://localhost:6379/0 PING
```

### "Email not sending"
```bash
# Verify SMTP settings
grep SMTP .env

# Test SMTP connection
python -c "import smtplib; smtplib.SMTP(host, port).starttls()"

# Check SMTP firewall
telnet smtp.gmail.com 587
```

### "Stripe API errors"
```bash
# Verify keys
grep STRIPE .env

# Test API key
python -c "import stripe; stripe.api_key='...'; stripe.Account.retrieve()"

# Check webhook URL is public/accessible
```

---

## 📖 References

- [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/models/)
- [environment_variables](https://docs.python-guide.org/writing/style/#avoid-hardcoding/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

---

## ✅ Ready to Go

Once your `.env` file is configured:

```bash
# Verify setup
python verify_production_ready.py

# Start services
docker-compose up -d

# Access dashboard
open http://localhost:3000
```

Login with: `admin@acme.com` / `admin123`

---

**Last Updated**: 2024-01-20  
**Version**: 1.0.0
