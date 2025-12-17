from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.api.dependencies.permission import require_admin, require_any_logged_in_user
from app.db.database import get_db
from app.schemas.order import OrderCreate, OrderOut, OrderTransitionRequest
from app.services.order.order import order_service
from app.schemas.order import CancelOrderRequest, CancelOrderResponse
from app.services.order.order_cancel_service import order_cancel_service
from typing import List

router = APIRouter(prefix="/orders", tags=["orders"])

# Get all orders - Admin only
@router.get("/", response_model=List[OrderOut])
def get_all_orders(
    db: Session = Depends(get_db),
    current_admin_payload: dict = Depends(require_admin),
    skip: int = 0,
    limit: int = 10
):
    return order_service.get_orders(db=db, skip=skip, limit=limit)

# Get my orders - Any logged-in user
@router.get("/my", response_model=List[OrderOut])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_any_logged_in_user),
    skip: int = 0,
    limit: int = 10
):
    user_id = int(current_user_payload.get("sub"))
    return order_service.get_orders_by_user(db=db, user_id=user_id, skip=skip, limit=limit)

@router.post("/", response_model=OrderOut)
def create_new_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_any_logged_in_user)
):
    user_id = int(current_user_payload.get("sub"))
    return order_service.create_order(db=db, user_id=user_id, order_data=order_data)


@router.patch("/{order_id}/transition", response_model=dict)
def transition_order_state(
    order_id: int,
    request_data: OrderTransitionRequest,
    db: Session = Depends(get_db),
    # background_tasks: BackgroundTasks,
    current_admin_payload: dict = Depends(require_admin)
):
    admin_id = int(current_admin_payload.get("sub"))
    return order_service.transition(
        db=db, order_id=order_id,
        # background_tasks=background_tasks,
        action=request_data.action, actor_id=admin_id
    )
    
@router.post("/cancel", response_model=CancelOrderResponse)
def cancel_order(req: CancelOrderRequest, 
                 db: Session = Depends(get_db),
                 current_user_payload: dict = Depends(require_any_logged_in_user)
                 ):
    # Protect endpoint: only logged-in users can cancel their orders
    _ = int(current_user_payload.get("sub"))
    return order_cancel_service.cancel_order(db, req.order_id)

    #  Need to improve: pass in user_id and check if the order belongs to the user