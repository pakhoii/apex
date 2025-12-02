from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.crud.base import CRUDBase
from app.models.cart import Cart, CartItem
from app.schemas.cart import CartCreate, CartUpdate

class CRUDCart(CRUDBase[Cart, CartCreate, CartUpdate]):
    def get_by_owner(self, db: Session, *, owner_id: int) -> Optional[Cart]:
        return (
            db.query(self.model)
            .options(joinedload(self.model.items))
            .filter(self.model.user_id == owner_id)
            .first()
        )
    
    def get_or_create_by_owner(self, db: Session, *, owner_id: int) -> Cart:
        cart = self.get_by_owner(db, owner_id=owner_id)
        if not cart:
            cart_in = CartCreate(user_id=owner_id)
            cart = self.create(db, input_object=cart_in)
            db.flush()
        return cart

    def add_item(self, db: Session, *, cart_id: int, model_id: int, quantity: int, unit_price: int) -> CartItem:
        # Check if item exists
        item = db.query(CartItem).filter(CartItem.cart_id == cart_id, CartItem.model_id == model_id).first()
        if item:
            item.quantity += quantity
            db.add(item)
        else:
            item = CartItem(cart_id=cart_id, model_id=model_id, quantity=quantity, unit_price=unit_price)
            db.add(item)
        db.flush()
        db.refresh(item)
        return item

    def update_item_quantity(self, db: Session, *, cart_id: int, model_id: int, quantity: int) -> Optional[CartItem]:
        item = db.query(CartItem).filter(CartItem.cart_id == cart_id, CartItem.model_id == model_id).first()
        if item:
            item.quantity = quantity
            db.add(item)
            db.flush()
            db.refresh(item)
        return item

    def remove_item(self, db: Session, *, cart_id: int, model_id: int) -> bool:
        item = db.query(CartItem).filter(CartItem.cart_id == cart_id, CartItem.model_id == model_id).first()
        if item:
            db.delete(item)
            db.flush()
            return True
        return False

crud_cart = CRUDCart(Cart)