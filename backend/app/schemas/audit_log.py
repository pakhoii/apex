from pydantic import BaseModel
from datetime import datetime

class AuditLogBase(BaseModel):
    entity_type: str
    entity_id: int
    actor_id: int
    action: str
    details: str | None = None


class AuditLogCreate(AuditLogBase): 
    pass


class AuditLogUpdate(BaseModel): 
    pass


class AuditLogOut(AuditLogBase):
    id: int
    timestamp: datetime
    class Config: orm_mode = True