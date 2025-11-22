from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from app.models.testdrive import TestDriveSlot, TestDriveBooking, BookingStatus
from app.schemas.testdrive import BookingCreate

class TestDriveSlotRepository:
    def get_all_slots(self, db: Session) -> List[TestDriveSlot]:
        return db.query(TestDriveSlot).all()

    def get_slot_by_id(self, db: Session, slot_id: int) -> Optional[TestDriveSlot]:
        return db.query(TestDriveSlot).filter(TestDriveSlot.id == slot_id).first()

    def get_active_slots(self, db: Session) -> List[TestDriveSlot]:
        return db.query(TestDriveSlot).filter(TestDriveSlot.is_active == True).all()

class TestDriveBookingRepository:
    def create_booking(self, db: Session, booking_data: BookingCreate, user_id: int) -> TestDriveBooking:
        db_booking = TestDriveBooking(
            user_id=user_id,
            model_id=booking_data.model_id,
            slot_id=booking_data.slot_id,
            scheduled_date=booking_data.scheduled_date,
            status=BookingStatus.SCHEDULED
        )
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        return db_booking

    def get_bookings_by_user(self, db: Session, user_id: int) -> List[TestDriveBooking]:
        return db.query(TestDriveBooking).filter(TestDriveBooking.user_id == user_id).all()

    def get_booking_by_id(self, db: Session, booking_id: int) -> Optional[TestDriveBooking]:
        return db.query(TestDriveBooking).filter(TestDriveBooking.id == booking_id).first()

    def get_booking_by_slot_date_model(self, db: Session, slot_id: int, scheduled_date: date, model_id: int) -> Optional[TestDriveBooking]:
        return db.query(TestDriveBooking).filter(
            TestDriveBooking.slot_id == slot_id,
            TestDriveBooking.scheduled_date == scheduled_date,
            TestDriveBooking.model_id == model_id
        ).first()

    def get_booked_slots(self, db: Session, model_id: int, scheduled_date: date) -> List[int]:
        """Return a list of slot_ids that are already booked for this model and date."""
        results = db.query(TestDriveBooking.slot_id).filter(
            TestDriveBooking.model_id == model_id,
            TestDriveBooking.scheduled_date == scheduled_date,
            TestDriveBooking.status != BookingStatus.CANCELLED
        ).all()
        return [r[0] for r in results]

testdrive_slot_repo = TestDriveSlotRepository()
testdrive_booking_repo = TestDriveBookingRepository()
