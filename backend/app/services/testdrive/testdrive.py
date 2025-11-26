from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.crud import crud_model, crud_testdrive_booking, crud_testdrive_slot, crud_audit_log
from app.schemas.testdrive import BookingCreate, TestDriveSlotCreate
from app.schemas.audit_log import AuditLogCreate
from app.models import TestDriveBooking, TestDriveSlot

class TestDriveService:
    # --- Booking Logic ---
    def create_booking(self, db: Session, *, user_id: int, booking_data: BookingCreate) -> TestDriveBooking:
        # 1. Validate model
        model = crud_model.get(db, id=booking_data.model_id)
        if not model or model.amount <= 0:
            raise HTTPException(status_code=400, detail="Model not available for test drive")

        # 2. Validate slot
        slot = crud_testdrive_slot.get(db, id=booking_data.slot_id)
        if not slot or not slot.is_active:
            raise HTTPException(status_code=400, detail="Invalid or inactive time slot")

        try:
            # Thao tác 1: Tạo booking (chưa commit)
            booking = crud_testdrive_booking.create_with_owner(db, obj_in=booking_data, user_id=user_id)
            
            # Thao tác 2: Ghi log (chưa commit)
            db.flush() # Lấy ID của booking
            log_data = AuditLogCreate(
                entity_type="TestDriveBooking", entity_id=booking.id, actor_id=user_id,
                action="create_booking", details=f"Booking created for model {booking.model_id}"
            )
            crud_audit_log.create(db=db, obj_in=log_data)

            # Commit toàn bộ transaction
            db.commit()
            db.refresh(booking)
            return booking
            
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=409, detail="This slot is already booked for this model on the selected date.")
        except Exception as e:
            db.rollback()
            raise e

    def get_user_bookings(self, db: Session, *, user_id: int) -> List[TestDriveBooking]:
        return crud_testdrive_booking.get_by_user(db, user_id=user_id)

    # --- Slot Logic ---
    def create_slot(self, db: Session, *, slot_data: TestDriveSlotCreate, user_id: int) -> TestDriveSlot:
        try:
            slot = crud_testdrive_slot.create(db, obj_in=slot_data)
            
            db.flush()
            log_data = AuditLogCreate(
                entity_type="TestDriveSlot", entity_id=slot.id, actor_id=user_id,
                action="create_slot", details=f"Slot created: {slot.start_time}-{slot.end_time}"
            )
            crud_audit_log.create(db=db, obj_in=log_data)
            
            db.commit()
            db.refresh(slot)
            return slot
        except Exception as e:
            db.rollback()
            raise e

    def get_available_slots(self, db: Session, *, model_id: Optional[int] = None, check_date: Optional[date] = None) -> List[TestDriveSlot]:
        active_slots = crud_testdrive_slot.get_active(db)
        
        if not model_id or not check_date:
            for slot in active_slots:
                slot.is_available = True
            return active_slots

        booked_slot_ids = crud_testdrive_booking.get_booked_slot_ids(db, model_id=model_id, scheduled_date=check_date)
        
        for slot in active_slots:
            slot.is_available = slot.id not in booked_slot_ids
            
        return active_slots

testdrive_service = TestDriveService()
