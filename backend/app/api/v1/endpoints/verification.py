from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from app.services.scanners.domain_verification import DomainVerificationService
from app.core.redis import get_redis
import uuid

router = APIRouter(prefix="/verify", tags=["verification"])

# Redis client for token storage
redis = get_redis()

@router.post("/token")
def get_verification_token(domain: str):
    """Generate a unique verification token for a domain"""
    token = str(uuid.uuid4())
    # Store in Redis with 1 hour expiration
    redis.setex(f"verify:{domain}", 3600, token)
    return {
        "domain": domain,
        "token": token,
        "dns_record": f"_sentinelnexus.{domain} TXT sentinelnexus-site-verification={token}",
        "file_path": "/.well-known/sentinelnexus-verification.txt",
        "file_content": token
    }

@router.get("/check")
async def check_verification(domain: str, method: str = "dns"):
    """Check if domain is verified via specified method"""
    token = redis.get(f"verify:{domain}")
    if not token:
        raise HTTPException(status_code=400, detail="No token generated for domain")
    
    verified = False
    if method == "dns":
        verified = await DomainVerificationService.verify_via_dns(domain, token)
    elif method == "file":
        verified = await DomainVerificationService.verify_via_file(domain, token)
    else:
        raise HTTPException(status_code=400, detail="Invalid verification method")
        
    return {
        "domain": domain,
        "method": method,
        "verified": verified
    }
