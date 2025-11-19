from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogCreate, AuditLogUpdate

class CRUDAuditLog(CRUDBase[AuditLog, AuditLogCreate, AuditLogUpdate]):
    def create(self, db: Session, *, input_object: AuditLogCreate) -> AuditLog:
        log_entry = self.model(**input_object.model_dump())
        db.add(log_entry)
        
        # Temporarily store to the database (have not commited yet)
        db.flush()
        return log_entry

    def get_by_entity(self, db: Session, *, entity_type: str, entity_id: int) -> List[AuditLog]:
        return db.query(self.model).filter(self.model.entity_type == entity_type, self.model.entity_id == entity_id).order_by(self.model.timestamp.desc()).all()

crud_audit_log = CRUDAuditLog(AuditLog)