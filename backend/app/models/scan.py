from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, JSON, Float, Index, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class Scan(Base):
    __tablename__ = "scans"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    
    scan_type = Column(String(50), nullable=False)  # code, prompt, pii, monitoring
    status = Column(String(20), default="pending")  # pending, running, completed, failed
    
    ai_risk_score = Column(Float, default=0.0)
    risk_level = Column(String(20))  # low, medium, high, critical
    
    findings_summary = Column(JSON, default={})
    file_count = Column(Integer, default=0)
    
    execution_time_seconds = Column(Integer)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    error_message = Column(Text)
    
    is_archived = Column(Boolean, default=False)
    
    __table_args__ = (
        Index("ix_scan_project_id", "project_id"),
        Index("ix_scan_status", "status"),
        Index("ix_scan_created_at", "created_at"),
    )
    
    project = relationship("Project", back_populates="scans")
    results = relationship("ScanResult", back_populates="scan", cascade="all, delete-orphan")


class ScanResult(Base):
    __tablename__ = "scan_results"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    
    finding_type = Column(String(100), nullable=False)
    severity = Column(String(20))  # low, medium, high, critical
    file_path = Column(String(500))
    line_number = Column(Integer)
    
    description = Column(Text)
    code_snippet = Column(Text)
    remediation = Column(Text)
    
    is_reviewed = Column(Boolean, default=False)
    is_resolved = Column(Boolean, default=False)
    
    extra_data = Column(JSON, default={})
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index("ix_result_scan_id", "scan_id"),
        Index("ix_result_severity", "severity"),
    )
    
    scan = relationship("Scan", back_populates="results")
