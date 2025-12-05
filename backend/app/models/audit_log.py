from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False) # e.g., "Order"
    entity_id = Column(Integer, nullable=False)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False) # e.g., "admin_confirm"
    details = Column(String(255)) # e.g., "Status changed from pending to confirmed"
    timestamp = Column(DateTime, server_default=func.now())