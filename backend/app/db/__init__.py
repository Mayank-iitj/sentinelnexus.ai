"""
Initialize database module.
"""

def init_db():
    """Initialize database with migrations and seed data."""
    from app.db.seed import seed_initial_data
    print("Initializing database...")
    seed_initial_data()
    print("Database initialization complete!")


def get_db_session():
    """Get database session for direct access."""
    from app.db.database import SessionLocal
    return SessionLocal()


__all__ = ["init_db", "get_db_session", "seed_initial_data"]
