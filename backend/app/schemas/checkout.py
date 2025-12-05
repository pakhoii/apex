from pydantic import BaseModel
from typing import List
from app.schemas.order import OrderItemOut
from app.core.enums import PaymentMethod

class CheckoutSummary(BaseModel):
    items: List[OrderItemOut]
    subtotal: int

class CheckoutRequest(BaseModel):
    shipping_address: str
    payment_method: PaymentMethod

class CheckoutResponse(BaseModel):
    order_id: int
    status: str # e.g., "confirmed", "processing", "pending"
    message: str