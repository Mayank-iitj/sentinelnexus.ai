# ⚡ AI Shield - Quick Reference Guide

## 🚀 Quick Start (5 minutes)

```bash
# Clone and navigate
cd aishield

# One-time setup
python setup.py

# Start everything
docker-compose up -d

# Access the platform
Frontend:  http://localhost:3000
API Docs:  http://localhost:8000/docs
API:       http://localhost:8000/api/v1
```

**Demo Login**:
- Email: `admin@acme.com`
- Password: `admin123`

---

## 📋 Common Commands

### Management
```bash
make help              # See all commands
make install          # Install dependencies
make install-dev      # Install dev dependencies
make test             # Run tests
make test-coverage    # Coverage report
make lint             # Check code quality
make format           # Format code
make clean            # Clean temp files
```

### Development
```bash
make run              # Start backend
make worker           # Start async worker
make beat             # Start scheduler
make frontend-dev     # Start Next.js dev
```

### Docker
```bash
make docker-build     # Build images
make docker-up        # Start services
make docker-down      # Stop services
make docker-logs      # View logs
make migrate          # Run migrations
make seed             # Seed demo data
```

### Verification
```bash
python verify_production_ready.py  # Pre-deployment check
bash validate_deployment.sh         # Deployment validation
python test_scanners.py            # Test all scanners
```

---

## 📁 Key Files & Locations

| Need | File | Purpose |
|------|------|---------|
| Configuration | `.env.example` | All settings template |
| Deployment | `docker-compose.yml` | Complete stack |
| Database | `backend/alembic/` | Schema migrations |
| Tests | `backend/tests/` | 26+ test cases |
| API | `backend/app/api/v1/` | 25+ endpoints |
| Frontend | `frontend/src/app/` | Next.js pages |
| Docs | `README.md` | Full documentation |
| API Docs | `API_REFERENCE.md` | Complete API |
| Operations | `PRODUCTION_RUNBOOK.md` | Deploy & monitor |

---

## 🔍 Core Scanning Engines

### Code Scanner
Detects in Python/JavaScript/TypeScript:
- Hardcoded API keys, passwords, tokens
- Dangerous functions (eval, exec, pickle)
- PII (email, phone, SSN, credit card)
- Unsafe logging patterns

**Usage**:
```python
from app.services.code_scanner import CodeScanner
scanner = CodeScanner()
findings = scanner.scan_code(code_content)
```

### Prompt Scanner
Analyzes LLM prompts for:
- Jailbreak attempts
- Injection patterns
- Sensitive keyword exposure
- System prompt leakage

**Risk Scores** (0-100 each):
- Jailbreak Risk
- Injection Risk
- Data Exfiltration Risk
- System Prompt Exposure

### PII Scanner
Identifies and classifies:
- Email addresses
- Phone numbers
- Credit cards
- SSN/Aadhaar/Passport
- IP addresses
- License plates

**Compliance Info**:
- GDPR Risk Level
- AI Act Risk Level
- Recommended Actions

### Policy Engine
Evaluates findings against custom rules:
- YAML-based policy definitions
- 3 default templates included
- Enterprise customization support

---

## 🔐 Authentication

### Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
# Returns: access_token, refresh_token
```

### Use Token
```bash
curl -H "Authorization: Bearer <access_token>" \
  http://localhost:8000/api/v1/auth/me
```

---

## 📊 API Endpoints (25+)

### Authentication
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Get tokens
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Current user

### Organizations
- `POST /api/v1/organizations` - Create org
- `GET /api/v1/organizations` - List all
- `GET /api/v1/organizations/{id}` - Get details
- `PUT /api/v1/organizations/{id}` - Update

### Projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects` - List projects
- `GET /api/v1/projects/{id}` - Get details
- `PUT /api/v1/projects/{id}` - Update
- `DELETE /api/v1/projects/{id}` - Delete

### Scans
- `POST /api/v1/scans/code` - Scan code
- `POST /api/v1/scans/prompt` - Scan prompt
- `POST /api/v1/scans/pii` - Scan for PII
- `GET /api/v1/scans/{id}` - Get results
- `GET /api/v1/scans` - List scans

### Alerts
- `GET /api/v1/alerts` - List alerts
- `GET /api/v1/alerts/{id}` - Get alert
- `PATCH /api/v1/alerts/{id}` - Update status
- `DELETE /api/v1/alerts/{id}` - Delete

### Subscriptions
- `GET /api/v1/subscriptions` - Current plan
- `POST /api/v1/subscriptions/upgrade` - Upgrade
- `POST /api/v1/subscriptions/stripe/webhook` - Stripe events

---

## 📈 Dashboard Metrics

**Overall AI Risk Score**
- 0-25: Green (Low Risk)
- 26-50: Yellow (Medium Risk)
- 51-75: Orange (High Risk)
- 76-100: Red (Critical Risk)

**Compliance Status**
- ✅ GDPR Compliant / ⚠️ Violations
- ✅ AI Act Compliant / ⚠️ High-Risk Systems
- ✅ SOC2 Ready / ⚠️ Gaps

**Key Metrics**
- Total Risk Score (0-100)
- Scans This Month
- Critical Issues
- PII Exposures Found
- Compliance Violations

---

## 🚨 Alert Types

| Alert | Trigger | Severity |
|-------|---------|----------|
| Critical Finding | Risk score > 75 | Critical |
| PII Exposure | PII detected in code | High |
| Compliance Violation | Policy broken | High |
| Scan Failed | Scan execution error | Medium |
| Quota Warning | Usage > 80% | Low |

---

## 🔧 Configuration

### Essential Environment Variables
```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/aishield

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secure-secret-key-here
ALGORITHM=HS256

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

See `.env.example` for all 50+ options.

---

## 📊 Database Schema

**Users**
- id, email (unique), username (unique)
- hashed_password, is_verified
- organization_id (FK), role (admin/viewer)

**Organizations**
- id, name, slug (unique)
- description, industry, country

**Projects**
- id, name, organization_id (FK)
- repo_type (github/gitlab/local)
- repo_url, is_public

**Scans**
- id, project_id (FK), scan_type
- status (pending/running/completed/failed)
- ai_risk_score, risk_level

**ScanResults**
- id, scan_id (FK)
- finding_type, severity
- file_path, line_number, description
- remediation, code_snippet

**Alerts**
- id, project_id (FK)
- alert_type, severity
- is_read, is_resolved

**AuditLogs**
- id, user_id (FK), organization_id (FK)
- action, resource_type, changes (JSON)
- ip_address, user_agent

**Subscriptions**
- id, organization_id (FK), plan
- stripe_customer_id, monthly_price
- scans_per_month, billing_cycle

---

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose logs backend

# Verify database connection
docker-compose exec db psql -U postgres -l

# Restart all
docker-compose restart
```

### API Returning 401
```bash
# Check token validity
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/v1/auth/me

# Login again if expired
make login
```

### Slow Scans
```bash
# Check worker status
docker-compose logs worker

# Verify Redis is running
docker-compose exec redis redis-cli ping

# Monitor resources
docker stats
```

### Database Errors
```bash
# Check migrations
docker-compose exec backend alembic current

# Manually run migration
docker-compose exec backend alembic upgrade head

# Seed demo data
docker-compose exec backend python -m app.db.seed
```

---

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": 1234567890,
  "components": {
    "database": "healthy",
    "cache": "healthy"
  }
}
```

### Performance
```bash
# View all service metrics
docker stats

# Database queries
docker-compose exec db psql -U postgres -c \
  "SELECT query, calls, mean_exec_time FROM pg_stat_statements"

# Cache stats
docker-compose exec redis redis-cli INFO
```

---

## 🚀 Deployment

### Docker Compose (Dev/Small Prod)
```bash
docker-compose up -d
```

### AWS
See DEPLOYMENT.md section "AWS ECS Fargate"

### DigitalOcean
See DEPLOYMENT.md section "DigitalOcean App Platform"

### Kubernetes
See DEPLOYMENT.md section "Kubernetes"

### Other Platforms
- Railway: 5-minute setup
- Heroku: buildpack included
- Render, Fly.io: supported

---

## 📚 Documentation Links

| Doc | Purpose |
|-----|---------|
| [README.md](README.md) | Overview & tech stack |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment |
| [API_REFERENCE.md](API_REFERENCE.md) | Complete API docs |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design |
| [PRODUCTION_RUNBOOK.md](PRODUCTION_RUNBOOK.md) | Operations |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete summary |

---

## 💡 Tips

1. **Read the docs**: Start with README.md → DEPLOYMENT.md
2. **Test locally**: Run `docker-compose up` before deploying
3. **Check logs**: `docker-compose logs -f service-name`
4. **Use demo account**: admin@acme.com / admin123
5. **Monitor dashboards**: Backend at :8000/docs, Frontend at :3000
6. **Scale horizontally**: Multiple backend containers behind load balancer
7. **Backup daily**: `docker-compose exec db pg_dump -U postgres aishield > backup.sql`

---

## ✨ What You Get

- ✅ **130+ production-ready files**
- ✅ **4 full-featured security scanners**
- ✅ **25+ REST API endpoints**
- ✅ **Modern React dashboard**
- ✅ **Multi-tenant architecture**
- ✅ **Async background workers**
- ✅ **Docker & Kubernetes ready**
- ✅ **Comprehensive documentation**
- ✅ **26+ test cases**
- ✅ **Production deployment guides**

---

## 🎯 Next Steps

1. **Local**: `docker-compose up`
2. **Test**: `python test_scanners.py`
3. **Configure**: Edit `.env`
4. **Deploy**: Follow `PRODUCTION_RUNBOOK.md`
5. **Monitor**: Check dashboards

---

**Questions?** See PROJECT_SUMMARY.md or PRODUCTION_RUNBOOK.md

**Ready?** Run: `docker-compose up` 🚀

---

*Last Updated: 2024-01-20 | Version 1.0.0*
