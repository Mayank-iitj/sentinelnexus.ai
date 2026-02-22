from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import secrets
import datetime
from app.db.database import get_db
from app.api.v1.deps import get_current_active_user
from app.models.user import User
from app.models.api_key import ApiKey
from app.schemas.api_key import ApiKeyCreate, ApiKeyResponse, ApiKeyCreated
from app.core.security import hash_api_key

router = APIRouter(prefix="/api-keys", tags=["api-keys"])

@router.get("/", response_model=List[ApiKeyResponse])
def list_api_keys(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all API keys for the current user"""
    return db.query(ApiKey).filter(ApiKey.user_id == current_user.id).all()

@router.post("/", response_model=ApiKeyCreated, status_code=status.HTTP_201_CREATED)
def create_api_key(
    key_in: ApiKeyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Generate a new API key"""
    # Generate full key
    plain_key = f"sn_{secrets.token_urlsafe(32)}"
    key_prefix = plain_key[:8]
    key_hash = hash_api_key(plain_key)
    
    db_key = ApiKey(
        user_id=current_user.id,
        name=key_in.name,
        key_prefix=key_prefix,
        key_hash=key_hash,
        expires_at=key_in.expires_at
    )
    
    db.add(db_key)
    db.commit()
    db.refresh(db_key)
    
    # Return with plain text key (only this once!)
    response = ApiKeyCreated.from_orm(db_key)
    response.plain_text_key = plain_key
    return response

@router.delete("/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_api_key(
    key_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Revoke an API key"""
    db_key = db.query(ApiKey).filter(
        ApiKey.id == key_id,
        ApiKey.user_id == current_user.id
    ).first()
    
    if not db_key:
        raise HTTPException(status_code=404, detail="API Key not found")
        
    db.delete(db_key)
    db.commit()
    return None
