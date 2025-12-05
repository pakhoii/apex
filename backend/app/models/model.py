from sqlalchemy import Column, Integer, String, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from app.db.database import Base

class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(BigInteger, nullable=False)
    year = Column(Integer, nullable=False)
    amount = Column(Integer, nullable=False)
    image_url = Column(String(255))

    brand = relationship("Brand", back_populates="models")
    order_items = relationship("OrderItem", back_populates="model")
    cart_items = relationship("CartItem", back_populates="model")
    wishlist_items = relationship("WishlistItem", back_populates="model")
    testdrive_records = relationship("TestdriveRecord", back_populates="model")
    testdrive_bookings = relationship("TestDriveBooking", back_populates="model")
