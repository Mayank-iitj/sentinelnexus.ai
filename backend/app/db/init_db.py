from sqlalchemy import text
from app.db.database import engine, SessionLocal, Base
from app.models import *
import logging

logger = logging.getLogger(__name__)


def init_db():
    """Initialize database schema"""
    
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")


def seed_db():
    """Seed database with initial data"""
    
    db = SessionLocal()
    try:
        # Add initial data here if needed
        db.commit()
        logger.info("Database seeded successfully")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    seed_db()
