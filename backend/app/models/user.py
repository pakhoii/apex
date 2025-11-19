import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.core.enums import UserRole
    

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True, index=True)
    phone_number = Column(String(15), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False, default=UserRole.USER)
    # is_2fa_enabled = True
    is_2fa_enabled = Column(Boolean(), default=False)
    
    # De day mot co loi thi uncomment
    # otp_secret = Column(String, nullable=True)

    # Relationships
    orders = relationship("Order", back_populates="user")
    carts = relationship("Cart", back_populates="user")
    wishlists = relationship("Wishlist", back_populates="user")
    messages = relationship("ContactMessage", back_populates="user")
