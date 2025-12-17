"""User service for managing user information."""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud.crud_user import crud_user
from app.schemas.user import UserUpdateMe, UserRoleUpdate, UserOut
from app.core.enums import UserRole
from app.models.user import User


class UserService:
    """Service for managing user information."""
    
    def get_user_info(self, db: Session, user_id: int) -> User:
        user = crud_user.get_by_id(db, user_id=user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        return user
    
    def update_user_info(
        self, 
        db: Session, 
        user_id: int, 
        user_update: UserUpdateMe
    ) -> User:
    
        # Get the user
        user = crud_user.get_by_id(db, user_id=user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        # Check if phone number is being updated and if it's already in use
        if user_update.phone_number is not None:
            existing_user = crud_user.get_by_phone(db, phone_number=user_update.phone_number)
            if existing_user and existing_user.id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Phone number already registered"
                )
        
        # Update the user
        updated_user = crud_user.update(db, db_object=user, input_object=user_update)
        db.commit()
        db.refresh(updated_user)
        
        return updated_user
    
    def update_user_role(
        self, 
        db: Session, 
        user_id: int, 
        role_update: UserRoleUpdate
    ) -> User:
        # Get the user
        user = crud_user.get_by_id(db, user_id=user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        # Update the role
        updated_user = crud_user.update_role(db, user=user, new_role=role_update.role)
        db.commit()
        db.refresh(updated_user)
        
        return updated_user


user_service = UserService()
