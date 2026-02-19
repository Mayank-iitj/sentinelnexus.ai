from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class PIIScan(Base):
    __tablename__ = "pii_scans"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scan_id = Column(String(36), ForeignKey("scans.id"))
    
    pii_type = Column(String(50), nullable=False)  # email, phone, credit_card, aadhaar, ssn, etc
    classification = Column(String(20))  # public, sensitive, highly_sensitive
    
    detected_count = Column(Integer, default=0)
    file_path = Column(String(500))
    line_number = Column(Integer)
    
    context = Column(Text)
    mask_pattern = Column(String(100))
    
    gdpr_risk = Column(String(20))  # low, medium, high, critical
    ai_act_risk = Column(String(20))  # low, medium, high, critical
    
    remediation = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index("ix_pii_scan_id", "scan_id"),
        Index("ix_pii_type", "pii_type"),
    )
