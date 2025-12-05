from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.api.dependencies.permission import require_admin, require_any_logged_in_user
from app.db.database import get_db
from app.schemas.order import OrderCreate, OrderOut, OrderTransitionRequest
from app.services.order.order import order_service

router = APIRouter(prefix="/orders", tags=["orders"])

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