from app.crud.base import CRUDBase
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderUpdate
from pydantic import BaseModel

class CRUDOrder(CRUDBase[Order, OrderCreate, OrderUpdate]):
    pass

crud_order = CRUDOrder(Order)