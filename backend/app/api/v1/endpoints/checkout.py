from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies.permission import require_any_logged_in_user
from app.db.database import get_db
from app.schemas.checkout import CheckoutRequest, CheckoutResponse, CheckoutSummary
from app.services.checkout.checkout import checkout_service
from app.services.cart.cart import cart_service

router = APIRouter(prefix="/checkout", tags=["Checkout"])

@router.post("/", response_model=CheckoutResponse)
def place_checkout(
    request_data: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_any_logged_in_user)
):
    user_id = int(current_user_payload.get("sub"))
    return checkout_service.place_order(db=db, user_id=user_id, request_data=request_data)


@router.get("/summary", response_model=CheckoutSummary)
def get_checkout_summary(
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_any_logged_in_user)
):
    user_id = int(current_user_payload.get("sub"))
    summary = cart_service.get_summary(db, user_id=user_id)
    return summary