from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(255))
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, server_default='1', nullable=False)
    is_verified = Column(Boolean, default=False, server_default='0', nullable=False)
    role = Column(String(20), default="viewer", server_default='viewer', nullable=False)  # admin, viewer
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    __table_args__ = (
        Index("ix_user_email", "email"),
        Index("ix_user_organization_id", "organization_id"),
    )
    
    organization = relationship("Organization", back_populates="users")
    audit_logs = relationship("AuditLog", back_populates="user")
    projects = relationship("Project", back_populates="created_by_user")
