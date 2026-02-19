# Architecture Overview

## System Design

AI Shield is built as a scalable, modular, multi-tenant SaaS platform with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  Next.js Frontend (React)  │  Mobile (Future)  │  CLI Tool  │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼────────┐
                    │   API Gateway    │
                    │ (Rate Limit, SSL)│
                    └─────────┬────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        │                     │                     │
    ┌───▼────┐           ┌───▼────┐           ┌───▼────┐
    │  Auth   │           │ Scans  │           │ Alerts │
    │ Service │           │Service │           │Service │
    └─────────┘           └────────┘           └────────┘
        │                     │
        └─────────────────────┼─────────────────────┐
                              │                     │
                    ┌─────────▼────────┐  ┌─────────▼────────┐
                    │   REST API v1    │  │  WebSocket (opt) │
                    │    FastAPI       │  └──────────────────┘
                    └─────────┬────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
    ┌───▼────┐            ┌───▼─────┐        ┌─────▼─────┐
    │ Policy │            │ Scanner │        │ Compliance │
    │ Engine │            │  Engine │        │  Engine    │
    └────────┘            └────┬────┘        └────────────┘
                               │
        ┌──────┬───────────────┼───────────────┬────────┐
        │      │               │               │        │
    ┌───▼──┐ ┌──▼───┐ ┌────▼────┐ ┌──────▼──┐ │        │
    │Code  │ │Prompt│ │PII      │ │Bias &  │ │        │
    │Scanner│ │Scanner│ │Detector │ │Toxicity│ │        │
    └──────┘ └──────┘ └─────────┘ └────────┘ │        │
                                 │            │
                    ┌────────────┴─────┬──────▼──┐
                    │                  │         │
                ┌───▼────┐        ┌───▼───┐    │
                │PostgreSQL       │Redis  │    │
                │Database  │      │Cache  │    │
                └────┬────┘       └───────┘    │
                     │                         │
        ┌────────────▼──────────────┐  ┌──────▼──┐
        │   Message Queue (Celery)  │  │External │
        │                           │  │Services │
        └───────────────────────────┘  └─────────┘
                     │
        ┌────────────▼──────────────┐
        │   Background Workers      │
        │  (Celery, Celery Beat)    │
        └───────────────────────────┘
```

## Component Architecture

### Frontend (Next.js)

**Responsibilities:**
- User authentication UI
- Dashboard with analytics
- Scan management interface
- Report generation
- Settings and configuration

**Key Features:**
- Server-side rendering (SSR) for SEO
- Static site generation (SSG) for landing pages
- Real-time updates with API polling
- Dark theme for security aesthetic
- Responsive design

### Backend (FastAPI)

**Responsibilities:**
- REST API endpoints
- User and organization management
- Multi-tenancy isolation
- Rate limiting and throttling
- Request validation and sanitization

**Key Features:**
- Async request handling
- Automatic OpenAPI documentation
- Dependency injection
- Request/response validation with Pydantic
- CORS and security middleware

### Scanning Engines

#### Code Security Scanner
- Detects hardcoded secrets (API keys, passwords)
- Identifies PII exposure (emails, phone numbers)
- Finds unsafe patterns (eval, exec, pickle.loads)
- AST-based Python analysis
- Supports multiple languages

#### Prompt Injection Scanner
- Detects jailbreak attempts
- Identifies injection vectors ({{var}}, $(), etc.)
- Finds sensitive keyword leakage
- Analyzes system prompt exposure risk
- Generates safer prompt alternatives

#### PII Detection Engine
- Email, phone, credit card, SSN, Aadhaar detection
- Data classification (public, sensitive, highly sensitive)
- GDPR and AI Act risk assessment
- Compliance recommendations
- Data flow analysis

### Compliance Engines

- **Policy Engine**: YAML-based rule evaluation
- **Compliance Engine**: GDPR, AI Act, SOC2 assessment
- **Audit Logger**: Complete activity tracking
- **Report Generator**: PDF audit report creation

### Background Workers

**Celery Tasks:**
- Async code scanning for large files
- Daily alert summary generation
- Subscription status checking
- Scheduled compliance reports
- Data archival

**Beat Scheduler:**
- Hourly: Subscription status checks
- Daily: Alert summaries
- Weekly: Compliance reports
- Monthly: Data cleanup

### Data Layer

**PostgreSQL:**
- User accounts and authentication
- Organizations and projects
- Scan results and findings
- Alerts and notifications
- Audit logs
- Subscription data

**Redis:**
- Session cache
- Rate limit counters
- Task queue (Celery broker)
- Task results storage
- Real-time event streaming

### External Integrations

- **OpenAI/Claude**: Prompt analysis and safer prompt generation
- **Google Cloud NLP**: Additional NLP processing
- **Stripe**: Payment processing
- **SMTP**: Email notifications
- **Slack**: Real-time alerts

## Data Flow

### Scanning Flow
```
1. User uploads code/prompt via frontend
2. Request hits FastAPI endpoint
3. Input validation with Pydantic
4. Scan record created in PostgreSQL
5. Scan job queued in Redis/Celery
6. Worker picks up job
7. Scanning engines process input
8. Findings stored in database
9. Compliance assessment performed
10. User notified via email/Slack
11. Results available in dashboard
```

### Authentication Flow
```
1. User submits login credentials
2. Backend validates credentials
3. JWT tokens generated
4. Access token returned to frontend
5. Frontend stores in localStorage
6. Subsequent requests include JWT in Authorization header
7. Middleware verifies token
8. Request processed in user context
9. Automatic refresh on token expiration
```

### Multi-Tenancy Architecture
```
- Organizations as primary tenant unit
- Projects belong to organizations
- Users assigned to organizations with roles
- Database row-level security for isolation
- API filters all queries by organization
- Audit logs track tenant activity
- Subscription limits per organization
```

## Security Architecture

### Network Layer
- HTTPS/TLS for all communication
- CORS protection with whitelist
- Rate limiting per IP/user
- DDoS protection (Cloudflare/AWS Shield)

### Application Layer
- Input validation (Pydantic)
- SQL injection prevention (SQLAlchemy)
- XSS prevention (React auto-escaping)
- CSRF protection (token-based)
- Password hashing (bcrypt with salt)

### Data Layer
- Field-level encryption for sensitive data
- Database encryption at rest
- Secure secret management (environment variables)
- Regular backups to secure storage
- Audit logging of all access

### Infrastructure Layer
- Private VPC for databases
- Security groups restricting access
- Secrets Manager for API keys
- IAM roles with least privilege
- Regular security patching

## Scalability Design

### Horizontal Scaling
- **Frontend**: CDN (CloudFront, Vercel Edge)
- **Backend**: Load balancer + multiple FastAPI instances
- **Workers**: Auto-scaling worker pool
- **Database**: Read replicas for scaling reads
- **Cache**: Redis Cluster for distributed caching

### Performance Optimization
- Database indexing on frequently queried fields
- Redis caching for repeated queries
- API response compression
- Frontend code splitting and lazy loading
- Async/parallel scanning for large files

### Cost Optimization
- Serverless option for variable workloads
- Reserved instances for baseline
- Auto-scaling to match demand
- Efficient database storage (pruning old data)
- CDN for static assets

## Deployment Architecture

### Development
```
Local Docker Compose with:
- PostgreSQL container
- Redis container
- FastAPI development server
- Next.js dev server
- Celery worker
```

### Staging
```
Similar to production but:
- Smaller instance sizes
- Non-critical data
- Staging database
- Manual deployment
```

### Production
```
- Kubernetes cluster (EKS/GKE) or
- Docker Swarm or
- Individual EC2s with load balancer
- RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis (Cluster mode)
- CloudFront CDN
- WAF + DDoS protection
- CloudWatch monitoring
```

## API Design Principles

- **RESTful**: Standard HTTP methods and status codes
- **Versioned**: /api/v1/ prefix for backward compatibility
- **Stateless**: JWT for authentication
- **Documented**: Auto-generated OpenAPI/Swagger
- **Rate Limited**: Per user, per IP, per organization
- **Paginated**: Limit and offset for list endpoints
- **Filtered**: Query parameters for advanced filtering
- **Validated**: Pydantic schemas for request/response

## Error Handling

```python
# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Specific exception handlers
@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": "Invalid request"}
    )
```

## Testing Strategy

- **Unit Tests**: Scanner engines, compliance logic
- **Integration Tests**: API endpoints, database
- **Security Tests**: SQL injection, XSS, CSRF
- **Performance Tests**: Load testing, stress testing
- **E2E Tests**: Full user workflows (Cypress/Playwright)

---

**AI Shield is architected for enterprise-scale security and compliance.**
