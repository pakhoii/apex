from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.testdrive import BookingCreate, BookingOut, TestDriveSlotOut
from app.services.testdrive.testdrive import testdrive_service

router = APIRouter(prefix="/test-drive", tags=["test-drive"])

@router.post("/bookings", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return testdrive_service.create_booking(db, current_user.id, booking_data)

@router.get("/bookings", response_model=List[BookingOut])
def get_my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return testdrive_service.get_user_bookings(db, current_user.id)

@router.get("/slots", response_model=List[TestDriveSlotOut])
def get_available_slots(
    db: Session = Depends(get_db)
):
    return testdrive_service.get_all_slots(db)
