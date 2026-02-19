from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Float, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class PromptScan(Base):
    __tablename__ = "prompt_scans"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id"))
    
    prompt_text = Column(Text, nullable=False)
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String(20))  # low, medium, high, critical
    
    jailbreak_susceptibility = Column(Float, default=0.0)
    injection_risk = Column(Float, default=0.0)
    data_exfiltration_risk = Column(Float, default=0.0)
    system_prompt_exposure = Column(Float, default=0.0)
    
    detected_risks = Column(JSON, default=[])
    remediation_suggestions = Column(JSON, default=[])
    suggested_prompt = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        Index("ix_prompt_project_id", "project_id"),
        Index("ix_prompt_risk_level", "risk_level"),
    )
