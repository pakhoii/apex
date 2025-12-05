from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="wishlists")
    items = relationship("WishlistItem", back_populates="wishlist", cascade="all, delete")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    wishlist_id = Column(Integer, ForeignKey("wishlists.id", ondelete="CASCADE"), primary_key=True)
    model_id = Column(Integer, ForeignKey("models.id", ondelete="CASCADE"), primary_key=True)

    wishlist = relationship("Wishlist", back_populates="items")
    model = relationship("Model", back_populates="wishlist_items")
