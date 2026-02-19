from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class AlertResponse(BaseModel):
    id: str
    project_id: str
    alert_type: str
    severity: str
    title: str
    description: Optional[str] = None
    is_read: bool
    is_resolved: bool
    metadata: Dict[str, Any] = {}
    triggered_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


class AlertUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_resolved: Optional[bool] = None
