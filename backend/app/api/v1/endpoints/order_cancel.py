from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.order_cancel import CancelOrderRequest, CancelOrderResponse
from app.services.order.order_cancel_service import order_cancel_service

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/cancel", response_model=CancelOrderResponse)
def cancel_order(req: CancelOrderRequest, db: Session = Depends(get_db)):
    return order_cancel_service.cancel_order(db, req.order_id)
