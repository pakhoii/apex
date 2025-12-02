from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api import deps
from app.services.cart.cart import cart_service
from app.schemas.cart import CartOut, CartItemCreate, CartItemUpdate
from app.models.user import User

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/", response_model=CartOut)
def get_my_cart(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    return cart_service.get_cart(db, user_id=current_user.id)

@router.post("/items", response_model=CartOut)
def add_item_to_cart(
    item_in: CartItemCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    return cart_service.add_to_cart(db, user_id=current_user.id, item_in=item_in)

@router.put("/items/{model_id}", response_model=CartOut)
def update_cart_item(
    model_id: int,
    item_in: CartItemUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    return cart_service.update_item(db, user_id=current_user.id, model_id=model_id, item_in=item_in)

@router.delete("/items/{model_id}", response_model=CartOut)
def remove_item_from_cart(
    model_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    return cart_service.remove_from_cart(db, user_id=current_user.id, model_id=model_id)
