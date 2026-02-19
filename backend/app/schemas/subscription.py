from pydantic import BaseModel
from typing import Optional


class SubscriptionResponse(BaseModel):
    id: str
    organization_id: str
    plan: str
    status: str
    scans_per_month: Optional[int] = None
    api_calls_per_day: Optional[int] = None
    includes_custom_rules: bool
    includes_slack: bool
    includes_soc2: bool
    monthly_price: int
    
    class Config:
        from_attributes = True


class UpgradeRequest(BaseModel):
    plan: str  # pro, enterprise


class StripeCheckoutRequest(BaseModel):
    plan: str
    success_url: str
    cancel_url: str
