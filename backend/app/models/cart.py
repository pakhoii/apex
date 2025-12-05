from sqlalchemy import Column, Integer, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from app.db.database import Base

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="carts")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete")


class CartItem(Base):
    __tablename__ = "cart_items"

    cart_id = Column(Integer, ForeignKey("carts.id", ondelete="CASCADE"), primary_key=True)
    model_id = Column(Integer, ForeignKey("models.id", ondelete="CASCADE"), primary_key=True)
    unit_price = Column(BigInteger, nullable=False)
    quantity = Column(Integer, nullable=False)

    cart = relationship("Cart", back_populates="items")
    model = relationship("Model", back_populates="cart_items")
