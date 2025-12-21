"""CRUD operations for User model."""
from typing import Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.enums import UserRole


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    """CRUD operations for User model."""
    
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(self.model).filter(self.model.email == email).first()
    
    def get_by_phone(self, db: Session, *, phone_number: str) -> Optional[User]:
        return db.query(self.model).filter(self.model.phone_number == phone_number).first()
    
    def get_by_id(self, db: Session, *, user_id: int) -> Optional[User]:
        return db.query(self.model).filter(self.model.id == user_id).first()
    
    def update_role(self, db: Session, *, user: User, new_role: UserRole) -> User:
        user.role = new_role
        db.add(user)
        db.flush()
        db.refresh(user)
        return user


crud_user = CRUDUser(User)
