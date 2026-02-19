from celery import Celery
from app.core.config import get_settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

celery_app = Celery(
    "ai_shield_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        'check-subscriptions': {
            'task': 'app.tasks.check_subscription_status',
            'schedule': 3600.0,  # Run hourly
        },
        'daily-summary': {
            'task': 'app.tasks.send_daily_alert_summary',
            'schedule': 86400.0,  # Run daily
        },
    }
)

if __name__ == "__main__":
    celery_app.start()
