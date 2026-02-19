from sqlalchemy.orm import Session
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationUpdate


class OrganizationService:
    @staticmethod
    def create_organization(db: Session, org_create: OrganizationCreate) -> Organization:
        db_org = Organization(
            name=org_create.name,
            slug=org_create.slug,
            description=org_create.description,
            industry=org_create.industry,
            country=org_create.country
        )
        db.add(db_org)
        db.commit()
        db.refresh(db_org)
        return db_org
    
    @staticmethod
    def get_organization_by_id(db: Session, org_id: str) -> Organization:
        return db.query(Organization).filter(Organization.id == org_id).first()
    
    @staticmethod
    def get_organization_by_slug(db: Session, slug: str) -> Organization:
        return db.query(Organization).filter(Organization.slug == slug).first()
    
    @staticmethod
    def update_organization(db: Session, org: Organization, org_update: OrganizationUpdate) -> Organization:
        update_data = org_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(org, field, value)
        db.commit()
        db.refresh(org)
        return org
    
    @staticmethod
    def list_organizations(db: Session, skip: int = 0, limit: int = 10):
        return db.query(Organization).offset(skip).limit(limit).all()
