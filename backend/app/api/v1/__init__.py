from fastapi import APIRouter

from app.api.v1.endpoints import auth, organizations, projects, scans, alerts, subscriptions

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(organizations.router)
api_router.include_router(projects.router)
api_router.include_router(scans.router)
api_router.include_router(alerts.router)
api_router.include_router(subscriptions.router)
