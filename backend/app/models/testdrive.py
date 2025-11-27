import enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Date, Time, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

from app.core.enums import TestDriveStatus

class TestDriveSlot(Base):
    __tablename__ = "testdrive_slots"

    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(Time, nullable=False, unique=True)
    end_time = Column(Time, nullable=False, unique=True)
    is_active = Column(Boolean, default=True, nullable=False)

    bookings = relationship("TestDriveBooking", back_populates="slot")

class TestDriveBooking(Base):
    __tablename__ = "testdrive_bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("testdrive_slots.id"), nullable=False)
    scheduled_date = Column(Date, nullable=False)
    status = Column(Enum(TestDriveStatus), default=TestDriveStatus.SCHEDULED, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="testdrive_bookings")
    model = relationship("Model", back_populates="testdrive_bookings")
    slot = relationship("TestDriveSlot", back_populates="bookings")

    __table_args__ = (
        UniqueConstraint('model_id', 'slot_id', 'scheduled_date', name='uq_model_slot_date'),
    )
