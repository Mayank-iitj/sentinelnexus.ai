from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON, Boolean, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    
    alert_type = Column(String(50), nullable=False)  # critical_risk, pii_leak, prompt_injection, etc
    severity = Column(String(20))  # low, medium, high, critical
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    
    is_read = Column(Boolean, default=False)
    is_resolved = Column(Boolean, default=False)
    
    extra_data = Column(JSON, default={})
    
    triggered_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index("ix_alert_project_id", "project_id"),
        Index("ix_alert_severity", "severity"),
    )
