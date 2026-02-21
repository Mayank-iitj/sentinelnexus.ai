# Deploying to Render

This guide explains how to deploy the SentinelNexus Guard backend to [Render](https://render.com) using the provided Blueprint.

## Quick Start (Blueprint)

1. **Connect your GitHub repository** to Render.
2. Render will automatically detect the `render.yaml` file in your root directory.
3. Click **"Apply"** to deploy the following stack:
   - **FastAPI Backend Service** (Web Service)
   - **Celery Worker Service** (Worker Service)
   - **PostgreSQL Database** (Managed Database)
   - **Redis Instance** (Managed Redis)

## Environment Variables

The Blueprint automatically handles most environment variables, but you may need to add others manually (e.g., API keys) in the Render Dashboard:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key (required for AI features) |
| `ALLOWED_HOSTS` | Set to your Render URL (e.g., `ai-shield-backend.onrender.com`) |
| `ALLOWED_ORIGINS` | Set to your frontend URL (e.g., `https://ai-shield-frontend.onrender.com`) |

## Manual Deployment (Step-by-Step)

If you prefer to set up services manually:

### 1. Database & Redis
- Create a **PostgreSQL** instance on Render.
- Create a **Redis** instance on Render.

### 2. Backend Web Service
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Plan**: Web Service

### 3. Celery Worker
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && celery -A app.celery_app worker --loglevel=info`
- **Plan**: Worker Service

## Troubleshooting

- **Migrations**: Since the application uses `Base.metadata.create_all(bind=engine)` in `main.py`, tables are created on first start. For future updates, run migrations manually if using Alembic: `cd backend && alembic upgrade head`.
- **Worker Connectivity**: Ensure the `REDIS_URL` matches the internal connection string of your Redis instance.
