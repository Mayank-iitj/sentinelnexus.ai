import os
import sys
import pytest

# Add backend to path for scanner imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Only import database-dependent modules when not running isolated scanner tests
# Check if we're in a CI environment or have database dependencies
_database_available = False
try:
    import psycopg2
    _database_available = True
except ImportError:
    pass

if _database_available or os.environ.get("DATABASE_TESTS", "0") == "1":
    from fastapi.testclient import TestClient
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.main import app
    from app.db.database import get_db, Base

    # Test database
    SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
    engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)


    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()


    app.dependency_overrides[get_db] = override_get_db


    @pytest.fixture
    def client():
        return TestClient(app)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)
