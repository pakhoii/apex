from app.crud.base import CRUDBase
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderUpdate
from pydantic import BaseModel
from sqlalchemy.orm import Session

class CRUDOrder(CRUDBase[Order, OrderCreate, OrderUpdate]):
    def get_multi_by_user(self, db: Session, *, user_id: int, skip: int = 0, limit: int = 10) -> list[Order]:
        return db.query(self.model).filter(Order.user_id == user_id).offset(skip).limit(limit).all()

crud_order = CRUDOrder(Order)