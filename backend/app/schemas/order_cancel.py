from pydantic import BaseModel
from typing import Optional

class CancelOrderRequest(BaseModel):
    order_id: int

class CancelOrderResponse(BaseModel):
    status: str  # e.g., "cancelled", "refunded", "not_eligible", "refund_failed"
    message: Optional[str] = None
