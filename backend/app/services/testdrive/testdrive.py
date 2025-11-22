from typing import Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.repositories.testdrive import testdrive_booking_repo, testdrive_slot_repo
from app.schemas.testdrive import BookingCreate
from app.models.model import Model

class TestDriveService:
    def check_availability(self, db: Session, model_id: int) -> bool:
        model = db.query(Model).filter(Model.id == model_id).first()
        if not model:
            raise HTTPException(status_code=404, detail="Model not found")
        return model.amount > 0

    def create_booking(self, db: Session, user_id: int, booking_data: BookingCreate):
        # 1. Check availability
        if not self.check_availability(db, booking_data.model_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Model is not available for test drive (out of stock)"
            )

        # 2. Check if slot exists and is active
        slot = testdrive_slot_repo.get_slot_by_id(db, booking_data.slot_id)
        if not slot or not slot.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or inactive time slot"
            )

        # 3. Try to create booking
        try:
            return testdrive_booking_repo.create_booking(db, booking_data, user_id)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This slot is already booked for this model on the selected date."
            )

    def get_user_bookings(self, db: Session, user_id: int):
        return testdrive_booking_repo.get_bookings_by_user(db, user_id)

    def get_all_slots(self, db: Session, model_id: Optional[int] = None, check_date: Optional[date] = None):
        slots = testdrive_slot_repo.get_active_slots(db)
        
        # If no filter provided, return all as available (default behavior)
        if not model_id or not check_date:
            # Convert SQLAlchemy models to Pydantic models (or dicts) with is_available=True
            # But since we return ORM objects, we need to attach the attribute dynamically or map it.
            # Better to return a list of dicts or let Pydantic handle it if we set the attribute.
            for slot in slots:
                slot.is_available = True
            return slots

        # Get booked slot IDs
        booked_slot_ids = testdrive_booking_repo.get_booked_slots(db, model_id, check_date)
        
        for slot in slots:
            slot.is_available = slot.id not in booked_slot_ids
            
        return slots

testdrive_service = TestDriveService()
