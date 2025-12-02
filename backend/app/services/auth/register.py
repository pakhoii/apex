from fastapi import HTTPException
from sqlalchemy.orm.session import Session
from passlib.context import CryptContext

from app.models.user import User
from app.schemas.user import UserCreate, AdminUserCreate
from app.services.utils.get_user import get_user_by_email, get_user_by_phone
from app.services.cart.cart import cart_service

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegisterService:
    def create_user(self, db: Session, user_data: UserCreate) -> User:
        """
        Create a new user in the database.

        Args:
            db (Session): The database session.
            user_data (UserCreate): The user data to create.

        Returns:
            User: The created user object.
        """
        if get_user_by_email(db, user_data.email):
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
            
        if get_user_by_phone(db, user_data.phone_number):
            raise HTTPException(
                status_code=400,
                detail="Phone number already registered"
            )
            
        hashed_password = pwd_context.hash(user_data.password)

        db_user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            phone_number=user_data.phone_number,
            password_hash=hashed_password,
        )

        db.add(db_user)
        db.flush()
        
        new_user = get_user_by_email(db, user_data.email)
        _ = cart_service.get_or_create_cart(db, user_id=new_user.id)
        
        db.commit()
        db.refresh(db_user)
        return db_user
    
    
    def create_user_as_admin(self, db: Session, user_data: AdminUserCreate) -> User:
        if get_user_by_email(db, user_data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
            
        if get_user_by_phone(db, user_data.phone_number):
            raise HTTPException(status_code=400, detail="Phone number already registered")
            
        hashed_password = pwd_context.hash(user_data.password)

        db_user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            phone_number=user_data.phone_number,
            password_hash=hashed_password,
            role=user_data.role
        )
        
        db.add(db_user)
        db.flush()
        
        new_user = get_user_by_email(db, user_data.email)
        _ = cart_service.get_or_create_cart(db, user_id=new_user.id)
            
        db.commit()
        db.refresh(db_user)
        return db_user
    
register_service = RegisterService()