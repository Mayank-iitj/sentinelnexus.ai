from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.db.database import get_db
from app.schemas.user import LoginRequest, TokenResponse, UserCreate, UserResponse
from app.services.user_service import UserService
from app.core.security import create_access_token, create_refresh_token, verify_token
from datetime import timedelta
import secrets

router = APIRouter(prefix="/auth", tags=["auth"])


class OAuthGoogleRequest(BaseModel):
    email: str
    name: Optional[str] = None
    image: Optional[str] = None
    provider_id: str


@router.post("/register", response_model=UserResponse)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (Disabled)"""
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Manual registration is disabled. Please use OAuth (Google, GitHub, or Microsoft)."
    )


@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password (Disabled)"""
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Manual login is disabled. Please use OAuth (Google, GitHub, or Microsoft)."
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(token: str, db: Session = Depends(get_db)):
    """Refresh access token"""
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user = UserService.get_user_by_id(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=timedelta(minutes=60)
    )
    
    return {
        "access_token": access_token,
        "refresh_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserResponse)
def get_current_user(token: str = None, db: Session = Depends(get_db)):
    """Get current user profile"""
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = UserService.get_user_by_id(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return user


@router.post("/login/form", response_model=TokenResponse)
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login with OAuth2 form (Disabled)"""
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Manual login is disabled. Please use OAuth."
    )


def sync_oauth_user(db: Session, email: str, name: Optional[str], provider_id: str, provider: str):
    """Internal helper to sync or create an OAuth user"""
    existing_user = UserService.get_user_by_email(db, email)
    
    if not existing_user:
        # Create new user from OAuth
        username = email.split('@')[0] + '_' + provider + '_' + provider_id[:4]
        random_password = secrets.token_urlsafe(32)
        
        user_create = UserCreate(
            email=email,
            username=username,
            password=random_password,
            full_name=name or username
        )
        existing_user = UserService.create_user(db, user_create)
    
    # Generate tokens
    access_token = create_access_token(
        data={"sub": existing_user.id, "email": existing_user.email},
        expires_delta=timedelta(minutes=60)
    )
    refresh_token = create_refresh_token({"sub": existing_user.id, "email": existing_user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": existing_user
    }


@router.post("/oauth/google", response_model=TokenResponse)
def oauth_google(oauth_data: OAuthGoogleRequest, db: Session = Depends(get_db)):
    """Handle Google OAuth sign-in/sign-up"""
    return sync_oauth_user(db, oauth_data.email, oauth_data.name, oauth_data.provider_id, "google")


class OAuthCommonRequest(BaseModel):
    email: str
    name: Optional[str] = None
    image: Optional[str] = None
    provider_id: str


@router.post("/oauth/github", response_model=TokenResponse)
def oauth_github(oauth_data: OAuthCommonRequest, db: Session = Depends(get_db)):
    """Handle GitHub OAuth sign-in/sign-up"""
    return sync_oauth_user(db, oauth_data.email, oauth_data.name, oauth_data.provider_id, "github")


@router.post("/oauth/microsoft", response_model=TokenResponse)
def oauth_microsoft(oauth_data: OAuthCommonRequest, db: Session = Depends(get_db)):
    """Handle Microsoft OAuth sign-in/sign-up"""
    return sync_oauth_user(db, oauth_data.email, oauth_data.name, oauth_data.provider_id, "microsoft")
