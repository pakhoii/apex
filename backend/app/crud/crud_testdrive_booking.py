from typing import List
from datetime import date
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.testdrive import TestDriveBooking
from app.schemas.testdrive import BookingCreate, BookingUpdate
from app.core.enums import TestDriveStatus

class CRUDTestDriveBooking(CRUDBase[TestDriveBooking, BookingCreate, BookingUpdate]):
    def create_with_owner(
        self, db: Session, *, obj_in: BookingCreate, user_id: int
    ) -> TestDriveBooking:
        db_obj = TestDriveBooking(
            **obj_in.model_dump(),
            user_id=user_id,
            status=TestDriveStatus.SCHEDULED
        )
        db.add(db_obj)
        # KHÔNG COMMIT Ở ĐÂY
        return db_obj

    def get_by_user(self, db: Session, *, user_id: int) -> List[TestDriveBooking]:
        return db.query(self.model).filter(self.model.user_id == user_id).all()

    def get_booked_slot_ids(self, db: Session, *, model_id: int, scheduled_date: date) -> List[int]:
        results = db.query(self.model.slot_id).filter(
            self.model.model_id == model_id,
            self.model.scheduled_date == scheduled_date,
            self.model.status != TestDriveStatus.CANCELLED
        ).all()
        return [r[0] for r in results]

crud_testdrive_booking = CRUDTestDriveBooking(TestDriveBooking)
