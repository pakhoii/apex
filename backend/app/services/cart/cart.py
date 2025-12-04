from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.crud import crud_cart
from app.crud.model import crud_model
from app.schemas.checkout import CheckoutSummary
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartOut

class CartService:   
    # Create cart for user if not exists and return it
    def get_or_create_cart(self, db: Session, *, user_id: int):
        return crud_cart.get_or_create_by_owner(db, owner_id=user_id)
    
    # Get the summary of the cart for checkout
    def get_summary(self, db: Session, *, user_id: int) -> CheckoutSummary:
        cart = crud_cart.get_by_owner(db, owner_id=user_id)
        
        if not cart or not cart.items:
            # Return empty summary instead of error for better UX? 
            # But the checkout logic expects items. 
            # For get_summary specifically for checkout, error is fine.
            # But for viewing cart, we might want empty list.
            # Let's keep it as is for checkout summary.
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        subtotal = sum(item.quantity * item.unit_price for item in cart.items)
        
        return CheckoutSummary(items=cart.items, subtotal=subtotal)
    
    def get_cart(self, db: Session, *, user_id: int) -> CartOut:
        cart = self.get_or_create_cart(db, user_id=user_id)
        return cart

    def add_to_cart(self, db: Session, *, user_id: int, item_in: CartItemCreate):
        # Check if model exists
        model = crud_model.get(db, id=item_in.model_id)
        if not model:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")
        
        cart = self.get_or_create_cart(db, user_id=user_id)
        
        crud_cart.add_item(db, cart_id=cart.id, model_id=item_in.model_id, quantity=item_in.quantity, unit_price=model.price)
        db.commit()
        db.refresh(cart)
        return cart

    def update_item(self, db: Session, *, user_id: int, model_id: int, item_in: CartItemUpdate):
        cart = self.get_or_create_cart(db, user_id=user_id)
        crud_cart.update_item_quantity(db, cart_id=cart.id, model_id=model_id, quantity=item_in.quantity)
        db.commit()
        db.refresh(cart)
        return cart

    def remove_from_cart(self, db: Session, *, user_id: int, model_id: int):
        cart = self.get_or_create_cart(db, user_id=user_id)
        crud_cart.remove_item(db, cart_id=cart.id, model_id=model_id)
        db.commit()
        db.refresh(cart)
        return cart

    def clear_cart(self, db: Session, *, user_id: int) -> None:
        cart = crud_cart.get_by_owner(db, owner_id=user_id)
        
        if cart and cart.items:
            for item in list(cart.items):
                db.delete(item)
            
cart_service = CartService()