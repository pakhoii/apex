from sqlalchemy import Column, Integer, DateTime, BigInteger, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    payment_date = Column(DateTime, nullable=False)
    amount = Column(BigInteger, nullable=False)
    payment_method = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)

    order = relationship("Order", back_populates="payments")
