from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from app.services.scanners.domain_verification import DomainVerificationService
import uuid

router = APIRouter(prefix="/verify", tags=["verification"])

# In-memory token store (Should be in DB for production)
pending_verifications = {}

@router.post("/token")
def get_verification_token(domain: str):
    """Generate a unique verification token for a domain"""
    token = str(uuid.uuid4())
    pending_verifications[domain] = token
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
    token = pending_verifications.get(domain)
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
