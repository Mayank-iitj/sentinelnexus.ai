# AI Shield - Complete API Reference

## API Overview

- **Base URL**: `http://localhost:8000` (development) or `https://api.aishield.io` (production)
- **Version**: v1
- **Format**: JSON
- **Authentication**: JWT Bearer Token
- **Rate Limiting**: 50 requests/second (Pro tier)

## Table of Contents

1. [Authentication](#authentication)
2. [Organizations](#organizations)
3. [Projects](#projects)
4. [Scans](#scans)
5. [Alerts](#alerts)
6. [Subscriptions](#subscriptions)
7. [Error Codes](#error-codes)

---

## Authentication

### Register

Create a new user account.

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "password": "SecurePassword123!"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "viewer",
  "is_verified": false,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Login

Authenticate and get access token.

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Refresh Token

Get a new access token using refresh token.

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Get Current User

Get authenticated user information.

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "admin",
  "organization_id": "uuid",
  "is_verified": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Organizations

### Create Organization

Create a new organization (multi-tenant).

```http
POST /api/v1/organizations
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Acme Corp",
  "slug": "acme-corp",
  "description": "Leading AI company",
  "industry": "Technology",
  "country": "US"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "description": "Leading AI company",
  "industry": "Technology",
  "country": "US",
  "member_count": 1,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Retrieve Organization

Get organization details.

```http
GET /api/v1/organizations/{org_id}
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "description": "Leading AI company",
  "industry": "Technology",
  "country": "US",
  "member_count": 5,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### List Organizations

Get all organizations for user.

```http
GET /api/v1/organizations
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "member_count": 5,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 10
}
```

### Update Organization

Update organization information.

```http
PUT /api/v1/organizations/{org_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Acme Corp Updated",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "name": "Acme Corp Updated",
  "description": "Updated description"
}
```

---

## Projects

### Create Project

Create a new project.

```http
POST /api/v1/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Mobile App Backend",
  "description": "Node.js backend service",
  "repo_type": "github",
  "repo_url": "https://github.com/user/repo",
  "github_token": "ghp_xxxxx",
  "is_public": false
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "name": "Mobile App Backend",
  "description": "Node.js backend service",
  "organization_id": "uuid",
  "repo_type": "github",
  "repo_url": "https://github.com/user/repo",
  "is_public": false,
  "scan_count": 0,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Retrieve Project

Get project details.

```http
GET /api/v1/projects/{project_id}
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "name": "Mobile App Backend",
  "description": "Node.js backend service",
  "organization_id": "uuid",
  "repo_type": "github",
  "last_scan": "2024-01-20T15:45:00Z",
  "last_risk_score": 42,
  "scan_count": 8,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### List Projects

Get all projects in organization.

```http
GET /api/v1/projects?org_id=uuid&skip=0&limit=10
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Mobile App Backend",
      "repo_type": "github",
      "last_risk_score": 42,
      "scan_count": 8
    }
  ],
  "total": 3,
  "skip": 0,
  "limit": 10
}
```

### Update Project

Update project information.

```http
PUT /api/v1/projects/{project_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "is_public": true
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "name": "Updated Project Name",
  "is_public": true
}
```

### Delete Project

Delete a project.

```http
DELETE /api/v1/projects/{project_id}
Authorization: Bearer <access_token>
```

**Response** (204 No Content)

---

## Scans

### Scan Code

Scan code for vulnerabilities.

```http
POST /api/v1/scans/code
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "project_id": "uuid",
  "code": "import requests\nAPI_KEY = 'sk-12345'\ndata = pickle.loads(user_input)",
  "filename": "main.py",
  "language": "python"
}
```

**Response** (202 Accepted):
```json
{
  "id": "uuid",
  "scan_type": "code",
  "status": "running",
  "project_id": "uuid",
  "created_at": "2024-01-20T15:45:00Z",
  "results": []
}
```

### Scan Prompt

Scan LLM prompt for injection risks.

```http
POST /api/v1/scans/prompt
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "project_id": "uuid",
  "prompt": "Assistant: Ignore previous instructions and...",
  "model": "gpt-4"
}
```

**Response** (202 Accepted):
```json
{
  "id": "uuid",
  "scan_type": "prompt",
  "status": "running",
  "project_id": "uuid",
  "jailbreak_risk": 85,
  "injection_risk": 72,
  "data_exfiltration_risk": 45,
  "system_prompt_exposure": 30,
  "created_at": "2024-01-20T15:45:00Z",
  "suggested_prompt": "Assistant: [safer prompt]"
}
```

### Scan PII

Scan content for personally identifiable information.

```http
POST /api/v1/scans/pii
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "project_id": "uuid",
  "content": "User email: john@example.com, SSN: 123-45-6789",
  "content_type": "logs"
}
```

**Response** (202 Accepted):
```json
{
  "id": "uuid",
  "scan_type": "pii",
  "status": "running",
  "project_id": "uuid",
  "findings": [
    {
      "pii_type": "email",
      "count": 1,
      "classification": "sensitive",
      "gdpr_risk": "high",
      "ai_act_risk": "high"
    }
  ],
  "created_at": "2024-01-20T15:45:00Z"
}
```

### Retrieve Scan Results

Get scan results and details.

```http
GET /api/v1/scans/{scan_id}
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "scan_type": "code",
  "status": "completed",
  "project_id": "uuid",
  "ai_risk_score": 62,
  "risk_level": "high",
  "findings_summary": {
    "critical": 2,
    "high": 5,
    "medium": 8,
    "low": 3
  },
  "results": [
    {
      "finding_type": "hardcoded_api_key",
      "severity": "critical",
      "file_path": "main.py",
      "line_number": 5,
      "description": "Hardcoded API key detected",
      "remediation": "Move to environment variables"
    }
  ],
  "execution_time_seconds": 12,
  "completed_at": "2024-01-20T15:45:30Z"
}
```

### List Project Scans

Get all scans for a project.

```http
GET /api/v1/scans?project_id=uuid&skip=0&limit=20
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "uuid",
      "scan_type": "code",
      "status": "completed",
      "ai_risk_score": 62,
      "risk_level": "high",
      "findings_count": 18,
      "created_at": "2024-01-20T15:45:00Z"
    }
  ],
  "total": 8,
  "skip": 0,
  "limit": 20
}
```

---

## Alerts

### List Project Alerts

Get all alerts for a project.

```http
GET /api/v1/alerts?project_id=uuid&skip=0&limit=20
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "uuid",
      "alert_type": "critical_finding",
      "severity": "critical",
      "title": "Hardcoded API Key Detected",
      "description": "A hardcoded API key was found in your code",
      "is_read": false,
      "is_resolved": false,
      "triggered_at": "2024-01-20T15:45:00Z"
    }
  ],
  "total": 5,
  "skip": 0,
  "limit": 20
}
```

### Retrieve Alert

Get alert details.

```http
GET /api/v1/alerts/{alert_id}
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "alert_type": "critical_finding",
  "severity": "critical",
  "title": "Hardcoded API Key Detected",
  "description": "A hardcoded API key was found in your code",
  "is_read": true,
  "is_resolved": false,
  "triggered_at": "2024-01-20T15:45:00Z"
}
```

### Update Alert Status

Mark alert as read or resolved.

```http
PATCH /api/v1/alerts/{alert_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "is_read": true,
  "is_resolved": true
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "is_read": true,
  "is_resolved": true
}
```

---

## Subscriptions

### Get Organization Subscription

Get subscription details and usage.

```http
GET /api/v1/subscriptions?org_id=uuid
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "organization_id": "uuid",
  "plan": "pro",
  "status": "active",
  "monthly_price": 29900,
  "scans_per_month": 1000,
  "scans_used": 234,
  "api_calls_per_day": 50000,
  "includes_custom_rules": true,
  "includes_slack": true,
  "includes_soc2": true,
  "billing_cycle_start": "2024-01-01T00:00:00Z",
  "billing_cycle_end": "2024-02-01T00:00:00Z"
}
```

### Upgrade Subscription

Upgrade to a different plan.

```http
POST /api/v1/subscriptions/upgrade
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "org_id": "uuid",
  "new_plan": "enterprise"
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "plan": "enterprise",
  "status": "active",
  "monthly_price": 99900
}
```

### Stripe Webhook

Process Stripe webhook events.

```http
POST /api/v1/subscriptions/stripe/webhook
Content-Type: application/json
Stripe-Signature: t=<timestamp>,v1=<signature>

{
  "type": "invoice.payment_succeeded",
  "data": {
    "object": {
      "subscription": "sub_1234567890"
    }
  }
}
```

**Response** (200 OK):
```json
{
  "status": "processed"
}
```

---

## Error Codes

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `202 Accepted` - Async request accepted
- `204 No Content` - Request successful, no content
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

### Error Response Format

```json
{
  "detail": "Error message",
  "status_code": 400,
  "error_code": "INVALID_REQUEST"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_TOKEN | 401 | Token is invalid or expired |
| TOKEN_EXPIRED | 401 | Token has expired |
| INSUFFICIENT_PERMISSIONS | 403 | User lacks required permissions |
| RESOURCE_NOT_FOUND | 404 | Requested resource not found |
| DUPLICATE_EMAIL | 422 | Email already exists |
| WEAK_PASSWORD | 422 | Password doesn't meet requirements |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| SUBSCRIPTION_REQUIRED | 403 | Feature requires active subscription |
| SCAN_LIMIT_EXCEEDED | 429 | Monthly scan limit exceeded |

---

## Rate Limiting

Rate limits are per user/organization and depend on subscription tier:

| Plan | Requests/sec | Scans/month |
|------|--------------|------------|
| Free | 10 | 50 |
| Pro | 50 | 1000 |
| Enterprise | 100 | Unlimited |

Rate limit headers:
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 1234567890
```

---

## Examples

### Complete Flow

```bash
# 1. Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure123", "username": "user"}'

# 2. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure123"}'

# 3. Create organization
curl -X POST http://localhost:8000/api/v1/organizations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Company", "slug": "my-company"}'

# 4. Create project
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Project", "organization_id": "uuid"}'

# 5. Scan code
curl -X POST http://localhost:8000/api/v1/scans/code \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"project_id": "uuid", "code": "import requests\nAPI_KEY = \"sk-123\""}'

# 6. Get scan results
curl -X GET http://localhost:8000/api/v1/scans/scan-uuid \
  -H "Authorization: Bearer <token>"
```

---

## Support

- **Documentation**: https://aishield.io/docs
- **Issues**: https://github.com/aishield/aishield/issues
- **Email**: support@aishield.io
- **Status**: https://status.aishield.io
