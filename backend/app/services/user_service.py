from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    @staticmethod
    def create_user(db: Session, user_create: UserCreate) -> User:
        hashed_password = hash_password(user_create.password)
        db_user = User(
            email=user_create.email,
            username=user_create.username,
            full_name=user_create.full_name,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> User:
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        user = UserService.get_user_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user
    
    @staticmethod
    def update_user(db: Session, user: User, user_update: UserUpdate) -> User:
        if user_update.full_name:
            user.full_name = user_update.full_name
        if user_update.email:
            user.email = user_update.email
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def verify_user(db: Session, user_id: str) -> User:
        user = UserService.get_user_by_id(db, user_id)
        user.is_verified = True
        db.commit()
        db.refresh(user)
        return user
