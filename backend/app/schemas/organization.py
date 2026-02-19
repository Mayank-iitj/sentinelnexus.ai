from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class OrganizationBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None


class OrganizationResponse(OrganizationBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OrganizationDetailResponse(OrganizationResponse):
    users: List = []
    projects: List = []
