from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    
    plan = Column(String(50), default="free")  # free, pro, enterprise
    status = Column(String(20), default="active")  # active, cancelled, expired
    
    stripe_customer_id = Column(String(255), unique=True)
    stripe_subscription_id = Column(String(255))
    
    scans_per_month = Column(Integer)
    api_calls_per_day = Column(Integer)
    includes_custom_rules = Column(Boolean, default=False)
    includes_slack = Column(Boolean, default=False)
    includes_soc2 = Column(Boolean, default=False)
    
    monthly_price = Column(Integer, default=0)
    billing_cycle_start = Column(DateTime(timezone=True))
    billing_cycle_end = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        Index("ix_sub_org_id", "organization_id"),
        Index("ix_sub_plan", "plan"),
    )
    
    organization = relationship("Organization", back_populates="subscriptions")
