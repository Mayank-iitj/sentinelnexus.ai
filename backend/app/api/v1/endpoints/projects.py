from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate, ProjectDetailResponse

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


@router.post("/", response_model=ProjectResponse)
def create_project(project_create: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project"""
    
    # Validate organization exists
    from app.models.organization import Organization
    org = db.query(Organization).filter(Organization.id == project_create.organization_id if hasattr(project_create, 'organization_id') else None).first()
    
    import uuid
    project = Project(
        id=str(uuid.uuid4()),
        name=project_create.name,
        description=project_create.description,
        repo_url=project_create.repo_url,
        repo_type=project_create.repo_type,
        is_public=False
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    
    return project


@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    """Get project details"""
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Add scan count
    scan_count = len(project.scans)
    response_data = {**project.__dict__, "scan_count": scan_count}
    
    return response_data


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update project"""
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    
    return project


@router.get("/org/{org_id}", response_model=list)
def list_org_projects(org_id: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """List all projects in an organization"""
    
    projects = db.query(Project).filter(
        Project.organization_id == org_id
    ).offset(skip).limit(limit).all()
    
    return projects


@router.delete("/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    """Delete a project"""
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(project)
    db.commit()
    
    return {"message": "Project deleted successfully"}
