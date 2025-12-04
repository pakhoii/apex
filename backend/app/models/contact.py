from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="messages")
    testdrive_records = relationship("TestdriveRecord", back_populates="message", cascade="all, delete")


class TestdriveRecord(Base):
    __tablename__ = "testdrive_records"

    message_id = Column(Integer, ForeignKey("contact_messages.id", ondelete="CASCADE"), primary_key=True)
    model_id = Column(Integer, ForeignKey("models.id"), primary_key=True)
    scheduled_date = Column(DateTime, nullable=False)
    status = Column(String(50), nullable=False)

    message = relationship("ContactMessage", back_populates="testdrive_records")
    model = relationship("Model", back_populates="testdrive_records")
