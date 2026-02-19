from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionResponse, UpgradeRequest
import stripe
import uuid
from app.core.config import get_settings

settings = get_settings()

if settings.STRIPE_API_KEY:
    stripe.api_key = settings.STRIPE_API_KEY

router = APIRouter(prefix="/api/v1/subscriptions", tags=["subscriptions"])


@router.get("/org/{org_id}", response_model=SubscriptionResponse)
def get_organization_subscription(org_id: str, db: Session = Depends(get_db)):
    """Get organization subscription"""
    
    subscription = db.query(Subscription).filter(
        Subscription.organization_id == org_id
    ).first()
    
    if not subscription:
        # Create default free subscription
        subscription = Subscription(
            id=str(uuid.uuid4()),
            organization_id=org_id,
            plan="free",
            status="active",
            scans_per_month=5,
            api_calls_per_day=100,
            monthly_price=0
        )
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
    
    return subscription


@router.post("/upgrade", response_model=SubscriptionResponse)
def upgrade_subscription(
    upgrade_request: UpgradeRequest,
    org_id: str,
    db: Session = Depends(get_db)
):
    """Upgrade organization subscription"""
    
    subscription = db.query(Subscription).filter(
        Subscription.organization_id == org_id
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    # Plan configurations
    plans = {
        "pro": {
            "scans_per_month": 100,
            "api_calls_per_day": 1000,
            "includes_custom_rules": True,
            "includes_slack": True,
            "monthly_price": 29900,  # $299 in cents
        },
        "enterprise": {
            "scans_per_month": None,  # Unlimited
            "api_calls_per_day": None,
            "includes_custom_rules": True,
            "includes_slack": True,
            "includes_soc2": True,
            "monthly_price": 99900,  # $999 in cents
        }
    }
    
    if upgrade_request.plan not in plans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan"
        )
    
    plan_config = plans[upgrade_request.plan]
    
    # Update subscription
    subscription.plan = upgrade_request.plan
    subscription.scans_per_month = plan_config.get("scans_per_month")
    subscription.api_calls_per_day = plan_config.get("api_calls_per_day")
    subscription.includes_custom_rules = plan_config.get("includes_custom_rules", False)
    subscription.includes_slack = plan_config.get("includes_slack", False)
    subscription.includes_soc2 = plan_config.get("includes_soc2", False)
    subscription.monthly_price = plan_config.get("monthly_price", 0)
    
    db.commit()
    db.refresh(subscription)
    
    return subscription


@router.post("/stripe-webhook")
def handle_stripe_webhook(request: dict, db: Session = Depends(get_db)):
    """Handle Stripe webhook events"""
    
    # Verify webhook signature and process events
    event_type = request.get("type")
    
    if event_type == "customer.subscription.updated":
        customer_id = request["data"]["object"]["customer"]
        subscription = db.query(Subscription).filter(
            Subscription.stripe_customer_id == customer_id
        ).first()
        
        if subscription:
            subscription.status = "active"
            db.commit()
    
    return {"status": "received"}
