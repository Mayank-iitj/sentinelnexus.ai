from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Boolean, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    created_by = Column(String(36), ForeignKey("users.id"))
    
    repo_url = Column(String(500))
    repo_type = Column(String(20))  # github, gitlab, local
    github_token = Column(String(500))
    
    is_public = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        Index("ix_project_org_id", "organization_id"),
        Index("ix_project_created_by", "created_by"),
    )
    
    organization = relationship("Organization", back_populates="projects")
    created_by_user = relationship("User", back_populates="projects")
    scans = relationship("Scan", back_populates="project", cascade="all, delete-orphan")
