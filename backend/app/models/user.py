from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True, index=True)
    phone_number = Column(String(15), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    is_2fa_enabled = True

    # Relationships
    orders = relationship("Order", back_populates="user")
    carts = relationship("Cart", back_populates="user")
    wishlists = relationship("Wishlist", back_populates="user")
    messages = relationship("ContactMessage", back_populates="user")
