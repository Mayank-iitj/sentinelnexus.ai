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

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class OAuthGoogleRequest(BaseModel):
    email: str
    name: Optional[str] = None
    image: Optional[str] = None
    provider_id: str


@router.post("/register", response_model=UserResponse)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    
    existing_user = UserService.get_user_by_email(db, user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = UserService.create_user(db, user_create)
    return user


@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password"""
    
    user = UserService.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=timedelta(minutes=60)
    )
    refresh_token = create_refresh_token({"sub": user.id, "email": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }


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
    """Login with OAuth2 form (for NextAuth credentials provider)"""
    
    user = UserService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=timedelta(minutes=60)
    )
    refresh_token = create_refresh_token({"sub": user.id, "email": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/oauth/google", response_model=TokenResponse)
def oauth_google(oauth_data: OAuthGoogleRequest, db: Session = Depends(get_db)):
    """Handle Google OAuth sign-in/sign-up"""
    
    # Check if user exists
    existing_user = UserService.get_user_by_email(db, oauth_data.email)
    
    if existing_user:
        # User exists, create tokens
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
    else:
        # Create new user from Google OAuth
        username = oauth_data.email.split('@')[0] + '_' + oauth_data.provider_id[:6]
        random_password = secrets.token_urlsafe(32)
        
        user_create = UserCreate(
            email=oauth_data.email,
            username=username,
            password=random_password,
            full_name=oauth_data.name or username
        )
        
        new_user = UserService.create_user(db, user_create)
        
        access_token = create_access_token(
            data={"sub": new_user.id, "email": new_user.email},
            expires_delta=timedelta(minutes=60)
        )
        refresh_token = create_refresh_token({"sub": new_user.id, "email": new_user.email})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": new_user
        }
