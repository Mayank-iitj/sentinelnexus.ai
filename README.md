# AI Shield - AI Compliance & Risk Intelligence Platform

Enterprise-grade AI security and compliance platform for scanning AI-powered applications for compliance risks, prompt vulnerabilities, data leaks, and regulatory exposure.

## 🌟 Features

### Core Capabilities
- **Code Security Scanning**: Detect hardcoded secrets, PII, unsafe patterns, and dangerous functions
- **Prompt Injection Detection**: Identify jailbreak attempts, injection vectors, and exfiltration risks
- **PII & Data Protection**: Scan for sensitive data and ensure GDPR/AI Act compliance
- **AI Risk Scoring**: 0-100 risk score with severity categorization
- **Compliance Reporting**: Generate audit-ready PDF reports
- **Real-time Alerts**: Email and Slack notifications
- **Continuous Monitoring**: Track toxicity, hallucination, bias, and drift

### Enterprise Features
- Multi-tenant architecture with organization isolation
- Role-based access control (RBAC)
- Custom policy engine (YAML-based)
- SOC2 readiness checklist
- Audit logging and evidence storage
- Stripe integration for payment processing

## 🏗️ Architecture

```
ai_shield/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/v1/         # REST API endpoints
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   │   ├── scanners/   # Security scanners
│   │   │   └── compliance/ # Compliance engines
│   │   ├── core/           # Config, security, database
│   │   ├── db/             # Database initialization
│   │   ├── main.py         # FastAPI app creation
│   │   ├── tasks.py        # Celery tasks
│   │   └── celery_app.py   # Celery configuration
│   ├── tests/              # Unit and integration tests
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # API client
│   │   ├── store/         # Zustand stores
│   │   └── types/         # TypeScript types
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── worker/                # Celery worker
│   ├── worker.py
│   └── requirements.txt
├── policies/              # YAML policy definitions
│   └── default.yaml
├── docker/                # Docker configuration
│   ├── Dockerfile.backend
│   └── Dockerfile.worker
├── docker-compose.yml     # Multi-container orchestration
└── .env.example           # Environment template
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- PostgreSQL 15
- Redis 7

### Local Development (Docker)

```bash
# Clone repository
git clone https://github.com/yourusername/ai-shield.git
cd ai-shield

# Setup environment
cp .env.example .env

# Update .env with your configuration
# - Database credentials
# - API keys (OpenAI, Google, Stripe)
# - SMTP settings
# - Slack webhook

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend python -m alembic upgrade head

# Create test data (optional)
docker-compose exec backend python -m app.db.init_db

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development (Manual)

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://user:password@localhost:5432/ai_shield_db"
export REDIS_URL="redis://localhost:6379/0"

# Run migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload
```

#### Worker Setup
```bash
cd backend

# In separate terminal
celery -A app.celery_app worker --loglevel=info
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📊 API Documentation

### Authentication
```bash
# Register
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword",
  "full_name": "User Name"
}

# Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "securepassword"
}

# Response
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "role": "admin"
  }
}
```

### Code Scanning
```bash
# Scan code for vulnerabilities
POST /api/v1/scans/code
Authorization: Bearer {access_token}
{
  "project_id": "project-uuid",
  "code_content": "... source code here ..."
}

# Response
{
  "id": "scan-uuid",
  "ai_risk_score": 45.5,
  "risk_level": "medium",
  "findings_summary": {
    "critical": 2,
    "high": 5,
    "medium": 12,
    "low": 8
  },
  "status": "completed"
}
```

### Prompt Scanning
```bash
# Analyze prompt for injection risks
POST /api/v1/scans/prompt
Authorization: Bearer {access_token}
{
  "project_id": "project-uuid",
  "prompt_text": "... LLM prompt ..."
}

# Response includes risk scores for:
# - Jailbreak susceptibility
# - Injection risk
# - Data exfiltration risk
# - System prompt exposure
```

### Get Scans
```bash
# List project scans
GET /api/v1/scans/project/{project_id}?skip=0&limit=10

# Get scan details
GET /api/v1/scans/{scan_id}
```

## 🔐 Security Features

- ✅ **Input Sanitization**: All inputs validated with Pydantic
- ✅ **Rate Limiting**: Configurable request throttling
- ✅ **CORS Protection**: Whitelist-based origin control
- ✅ **CSRF Protection**: Token-based protection
- ✅ **Password Security**: Bcrypt hashing with salt
- ✅ **JWT Auth**: Stateless authentication with refresh tokens
- ✅ **SQL Injection Prevention**: Parameterized queries via SQLAlchemy
- ✅ **File Upload Validation**: Size and type restrictions
- ✅ **Secret Management**: Environment-based configuration
- ✅ **HTTPS/TLS Ready**: Production-ready SSL termination

## 🧪 Testing

```bash
# Run all tests
pytest backend/tests/ -v

# Run specific test
pytest backend/tests/test_code_scanner.py -v

# Run with coverage
pytest backend/tests/ --cov=app/

# Coverage report
pytest backend/tests/ --cov=app/ --cov-report=html
```

### Test Coverage
- Code Scanner: 8 tests
- Prompt Scanner: 7 tests
- PII Scanner: 7 tests
- API Endpoints: 6 tests

## 📈 Deployment

### AWS Deployment
```bash
# Build Docker images
docker-compose build

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {account-id}.dkr.ecr.us-east-1.amazonaws.com

docker tag ai-shield-backend:latest {account-id}.dkr.ecr.us-east-1.amazonaws.com/ai-shield-backend:latest
docker push {account-id}.dkr.ecr.us-east-1.amazonaws.com/ai-shield-backend:latest

# Deploy with ECS, Fargate, or EKS
```

### DigitalOcean / Railway / Render
```bash
# These platforms support docker-compose.yml directly
# Simply push to their git and they'll deploy automatically

git push heroku main
```

### Kubernetes Deployment
```bash
# Update docker-compose to Kubernetes manifests
kompose convert -f docker-compose.yml -o k8s/

# Deploy to Kubernetes cluster
kubectl apply -f k8s/
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for complete list. Key variables:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis & Celery
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1

# Security
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-change-in-production

# External APIs
OPENAI_API_KEY=sk-...
STRIPE_API_KEY=sk_...

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

## 📊 Database Schema

### Users
- id, email, username, hashed_password, role, is_verified, organization_id, created_at, updated_at, last_login

### Organizations
- id, name, slug, description, logo_url, industry, country, created_at, updated_at

### Projects
- id, name, organization_id, created_by, repo_url, repo_type, is_public, created_at, updated_at

### Scans
- id, project_id, scan_type, status, ai_risk_score, risk_level, findings_summary, execution_time_seconds, created_at, updated_at, completed_at

### ScanResults
- id, scan_id, finding_type, severity, file_path, line_number, description, remediation, is_reviewed, is_resolved

### Alerts
- id, project_id, alert_type, severity, title, description, is_read, is_resolved, triggered_at

### Subscriptions
- id, organization_id, plan, status, stripe_customer_id, scans_per_month, includes_custom_rules, monthly_price

## 🔄 Celery Tasks

### Async Scanning
- `scan_code_async(scan_id, code_content)`
- Background processing for large scans
- Status updates via WebSocket (optional)

### Scheduled Tasks
- `check_subscription_status` - Hourly
- `send_daily_alert_summary` - Daily

### Monitoring
```bash
# View active tasks
celery -A app.celery_app inspect active

# View workers
celery -A app.celery_app inspect registered

# Monitor with Flower (optional)
pip install flower
celery -A app.celery_app flower
```

## 📚 API Rate Limits

- Authentication: 10 requests/minute
- Scans: 100 requests/hour (free), unlimited (pro/enterprise)
- API: 100 requests/minute (default)

## 🎯 Roadmap

- [ ] GitHub integration for automatic scanning
- [ ] AI-powered remediation suggestions (GPT-4)
- [ ] Model comparison and versioning
- [ ] Advanced bias detection
- [ ] Fine-tuned hallucination detection model
- [ ] Custom ML model training
- [ ] Enterprise SSO support
- [ ] Webhook system for integrations

## 🤝 Contributing

Contributions welcome! Please follow:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Submit pull request

## 📄 License

MIT License - See LICENSE file

## 💬 Support

- Documentation: https://docs.aishield.io
- Email: support@aishield.io
- Slack: https://aishield-community.slack.com

## 🛠️ Tech Stack

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy + Alembic
- PostgreSQL 15
- Redis 7
- Celery + Celery Beat
- Pydantic v2

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Zustand
- Axios

### DevOps
- Docker & Docker Compose
- GitHub Actions
- Stripe API
- AWS/GCP ready

---

**Built for enterprise security. Deploy to production with confidence.**
