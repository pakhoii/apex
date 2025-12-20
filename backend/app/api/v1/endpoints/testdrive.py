from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies.permission import require_any_logged_in_user, require_admin
from app.schemas.testdrive import BookingCreate, BookingOut, TestDriveSlotOut, TestDriveSlotCreate
from app.services.testdrive.testdrive import testdrive_service

router = APIRouter(prefix="/test-drive", tags=["Test Drive"])

# --- Booking Endpoints ---
@router.post("/bookings", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    payload: dict = Depends(require_any_logged_in_user),
    db: Session = Depends(get_db)
):
    user_id = int(payload.get("sub"))
    return testdrive_service.create_booking(db=db, user_id=user_id, booking_data=booking_data)

@router.get("/bookings", response_model=List[BookingOut])
def get_all_bookings(
    payload: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return testdrive_service.get_all_bookings(db=db)

@router.get("/bookings/me", response_model=List[BookingOut])
def get_my_bookings(
    payload: dict = Depends(require_any_logged_in_user),
    db: Session = Depends(get_db)
):
    user_id = int(payload.get("sub"))
    return testdrive_service.get_user_bookings(db=db, user_id=user_id)

# --- Slot Endpoints ---
@router.get("/slots", response_model=List[TestDriveSlotOut])
def get_available_slots(
    db: Session = Depends(get_db),
    model_id: Optional[int] = None,
    date: Optional[date] = None,
):
    return testdrive_service.get_available_slots(db=db, model_id=model_id, check_date=date)

@router.post("/slots", response_model=TestDriveSlotOut, status_code=status.HTTP_201_CREATED)
def create_new_slot(
    slot_data: TestDriveSlotCreate,
    payload: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    admin_id = int(payload.get("sub"))
    return testdrive_service.create_slot(db=db, slot_data=slot_data, user_id=admin_id)
