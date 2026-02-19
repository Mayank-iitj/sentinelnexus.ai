"""
Database seeding script with sample data.
"""

import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models.user import User
from app.models.organization import Organization
from app.models.project import Project
from app.models.subscription import Subscription
from app.db.database import SessionLocal


def seed_initial_data():
    """Seed database with initial data."""
    db = SessionLocal()
    
    try:
        # Check if already seeded
        existing_org = db.query(Organization).first()
        if existing_org:
            print("✓ Database already seeded")
            return
        
        print("🌱 Seeding database...")
        
        # Create a demo organization
        demo_org = Organization(
            id=str(uuid.uuid4()),
            name="Acme Tech Corp",
            slug="acme-tech",
            description="Leading AI innovation company",
            industry="Technology",
            country="US"
        )
        db.add(demo_org)
        db.flush()
        
        # Create demo users
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin@acme.com",
            username="admin",
            full_name="Admin User",
            hashed_password=hash_password("admin123"),
            is_active=True,
            is_verified=True,
            role="admin",
            organization_id=demo_org.id
        )
        
        viewer_user = User(
            id=str(uuid.uuid4()),
            email="viewer@acme.com",
            username="viewer",
            full_name="Viewer User",
            hashed_password=hash_password("viewer123"),
            is_active=True,
            is_verified=True,
            role="viewer",
            organization_id=demo_org.id
        )
        
        db.add(admin_user)
        db.add(viewer_user)
        db.flush()
        
        # Create demo subscription
        subscription = Subscription(
            id=str(uuid.uuid4()),
            organization_id=demo_org.id,
            plan="pro",
            status="active",
            scans_per_month=1000,
            api_calls_per_day=50000,
            includes_custom_rules=True,
            includes_slack=True,
            includes_soc2=True,
            monthly_price=29900,  # $299
            billing_cycle_start=datetime.utcnow(),
            billing_cycle_end=datetime.utcnow() + timedelta(days=30)
        )
        db.add(subscription)
        db.flush()
        
        # Create demo projects
        projects = [
            Project(
                id=str(uuid.uuid4()),
                name="Mobile App Backend",
                description="Node.js/Express backend for mobile app",
                organization_id=demo_org.id,
                created_by=admin_user.id,
                repo_type="github",
                is_public=False
            ),
            Project(
                id=str(uuid.uuid4()),
                name="AI Chatbot Service",
                description="LLM-powered chatbot service",
                organization_id=demo_org.id,
                created_by=admin_user.id,
                repo_type="github",
                is_public=False
            ),
            Project(
                id=str(uuid.uuid4()),
                name="Data Pipeline",
                description="ETL pipeline for ML training data",
                organization_id=demo_org.id,
                created_by=admin_user.id,
                repo_type="local",
                is_public=False
            )
        ]
        
        for project in projects:
            db.add(project)
        
        db.commit()
        
        print("✅ Database seeded successfully!")
        print(f"\n📊 Created:")
        print(f"   - Organization: {demo_org.name}")
        print(f"   - Users: admin@acme.com (admin), viewer@acme.com (viewer)")
        print(f"   - Subscription: Pro ($299/mo)")
        print(f"   - Projects: {len(projects)}")
        print(f"\n🔑 Demo Credentials:")
        print(f"   Email: admin@acme.com")
        print(f"   Password: admin123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_initial_data()
