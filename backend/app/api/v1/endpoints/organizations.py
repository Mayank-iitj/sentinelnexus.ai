from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.organization import Organization
from app.models.user import User
from app.schemas.organization import OrganizationCreate, OrganizationResponse, OrganizationUpdate
from app.services.organization_service import OrganizationService

router = APIRouter(prefix="/api/v1/organizations", tags=["organizations"])


@router.post("/", response_model=OrganizationResponse)
def create_organization(org_create: OrganizationCreate, db: Session = Depends(get_db)):
    """Create a new organization"""
    
    org = OrganizationService.create_organization(db, org_create)
    return org


@router.get("/{org_id}", response_model=OrganizationResponse)
def get_organization(org_id: str, db: Session = Depends(get_db)):
    """Get organization details"""
    
    org = OrganizationService.get_organization_by_id(db, org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return org


@router.put("/{org_id}", response_model=OrganizationResponse)
def update_organization(
    org_id: str,
    org_update: OrganizationUpdate,
    db: Session = Depends(get_db)
):
    """Update organization"""
    
    org = OrganizationService.get_organization_by_id(db, org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    org = OrganizationService.update_organization(db, org, org_update)
    return org


@router.get("/", response_model=list)
def list_organizations(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """List all organizations"""
    
    orgs = OrganizationService.list_organizations(db, skip, limit)
    return orgs
