from typing import Optional
from datetime import date, time, datetime
from pydantic import BaseModel, Field
from app.models.testdrive import BookingStatus

# --- Slot Schemas ---
class TestDriveSlotBase(BaseModel):
    start_time: time
    end_time: time
    is_active: bool = True

class TestDriveSlotCreate(TestDriveSlotBase):
    pass

class TestDriveSlotOut(TestDriveSlotBase):
    id: int

    class Config:
        from_attributes = True

# --- Booking Schemas ---
class BookingBase(BaseModel):
    model_id: int
    slot_id: int
    scheduled_date: date

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: BookingStatus

class BookingOut(BookingBase):
    id: int
    user_id: int
    status: BookingStatus
    created_at: datetime
    
    # We might want to include nested objects later, but for now keep it simple
    
    class Config:
        from_attributes = True
