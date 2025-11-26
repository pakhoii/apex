from typing import List
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.testdrive import TestDriveSlot
from app.schemas.testdrive import TestDriveSlotCreate
from pydantic import BaseModel

class TestDriveSlotUpdate(BaseModel): pass # Slot không cần update phức tạp

class CRUDTestDriveSlot(CRUDBase[TestDriveSlot, TestDriveSlotCreate, TestDriveSlotUpdate]):
    def get_active(self, db: Session) -> List[TestDriveSlot]:
        return db.query(self.model).filter(self.model.is_active == True).all()

crud_testdrive_slot = CRUDTestDriveSlot(TestDriveSlot)
