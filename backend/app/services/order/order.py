from fastapi import HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.enums import OrderAction, OrderStatus
from app.services.order.state_machine import handle_transition, InvalidTransitionError
from app.crud import crud_order, crud_audit_log, crud_model
from app.schemas import order as order_schemas
from app.schemas.audit_log import AuditLogCreate
from app.models import Order, OrderItem
from app.models.payment import Payment
from app.core.enums import PaymentMethod, PaymentStatus

class OrderService:
    def create_order(self, db: Session, *, user_id: int,
                     order_data: order_schemas.OrderCreate) -> Order:
        # Take the information of all models that user want to buy
        model_ids = [item.model_id for item in order_data.items]
        models_in_db = crud_model.get_multi_by_ids(db, ids=model_ids)
        
        # If the amount of models taken from db diffrent from the amount of model_ids -> some models do not exist in the database
        if len(models_in_db) != len(model_ids):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or more models not found")
        
        # Create a map to search faster
        models_map = {model.id: model for model in models_in_db}
        
        # Check for the remaining items in the database
        for item in order_data.items:
            model = models_map.get(item.model_id)
            if not model:
                 raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Model with id {item.model_id} not found")
            if model.amount < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Not enough stock for model '{model.name}'. Available: {model.amount}, Requested: {item.quantity}"
                )
                
        try:
            # Start a new order
            new_order = Order(
                user_id=user_id,
                shipping_address=order_data.shipping_address,
                order_date=datetime.now(),
                status=OrderStatus.PENDING.value
            )
            
            for item in order_data.items:
                model = models_map.get(item.model_id)
                
                order_item = OrderItem (
                    model_id=item.model_id,
                    quantity=item.quantity,
                    unit_price=model.price
                )
                
                new_order.items.append(order_item)
                model.amount -= item.quantity
                
            db.add(new_order)
            
            # Temporarily add new order to the database
            db.flush()
            
            log_data = AuditLogCreate (
                # Use new_order.id from the temporary value in db
                entity_type="Order", entity_id=new_order.id, actor_id=user_id,
                action="create_order", details=f"Order created with status {new_order.status}"
            )
            
            crud_audit_log.create(db=db, input_object=log_data)
            
            # db.commit() -> Remove commit to let caller handle transaction
            db.flush()
            db.refresh(new_order)
            
            return new_order
                
        except Exception as e:
            # If there is any error before commit -> rollback all changes
            # db.rollback() -> Caller should handle rollback
            raise e
    
    def user_confirm_delivery(self, db: Session, order_id: int, user_id: int) -> dict:
        """Allow user to confirm delivery of their own order"""
        order = crud_order.get(db, id=order_id)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
        # Verify the order belongs to the user
        if order.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only confirm delivery of your own orders")
        
        # Use the existing transition method with user_confirm_delivery action
        return self.transition(
            db=db, order_id=order_id,
            action=OrderAction.USER_CONFIRM_DELIVERY, actor_id=user_id
        )
    
    def transition( self, db: Session, order_id: int, 
                    # background_tasks: BackgroundTasks,
                    action: OrderAction, actor_id: int) -> dict:
        # Get the order based on order id
        order = crud_order.get(db, id=order_id)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        current_state = OrderStatus(order.status)

        try:
            # Update order status
            new_state = handle_transition(current_state, action)
            order.status = new_state.value
            db.add(order)
            
            # Record the log
            log_data = AuditLogCreate(
                entity_type="Order",
                entity_id=order.id,
                actor_id=actor_id,
                action=action.value,
                details=f"Status changed from {current_state.value} to {new_state.value}"
            )
            crud_audit_log.create(db=db, input_object=log_data)
            
            # Send notification (background, run after the response is sent)
            # Extend in the future
            # background_tasks.add_task(
            #     notification_service.send_order_status_change,
            #     order_id=order.id,
            #     user_email=order.user.email,
            #     from_status=current_state.value,
            #     to_status=new_state.value
            # )
            
            db.commit()
            
            return {"order_id": order.id, "new_state": new_state.value}

        except InvalidTransitionError as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
        
        except Exception as e:
            db.rollback()
            raise e
        
    # Private method to create payment record
    def _create_payment_record(self, db: Session, *, order_id: int, amount: int, method: PaymentMethod, status: PaymentStatus) -> Payment:
        payment = Payment(
            order_id=order_id,
            payment_date=datetime.now(),
            amount=amount,
            payment_method=method.value,
            status=status.value
        )
        db.add(payment)
        return payment
    
    def mark_paid(self, db: Session, *, order_id: int, amount: int, method: PaymentMethod):
        self._create_payment_record(db, order_id=order_id, amount=amount, method=method, status=PaymentStatus.PAID)
        # Update order status to CONFIRMED
        order = crud_order.get(db, id=order_id)
        if order:
            order.status = OrderStatus.CONFIRMED.value
            db.add(order)
        
    def mark_pending_payment(self, db: Session, *, order_id: int, amount: int, method: PaymentMethod):
        self._create_payment_record(db, order_id=order_id, amount=amount, method=method, status=PaymentStatus.PENDING)
        # Order status remains PENDING

    def mark_failed_payment(self, db: Session, *, order_id: int, amount: int, method: PaymentMethod):
        self._create_payment_record(db, order_id=order_id, amount=amount, method=method, status=PaymentStatus.FAILED)
        # Update order status to CANCELLED
        order = crud_order.get(db, id=order_id)
        if order:
            order.status = OrderStatus.CANCELLED.value
            db.add(order)
    
    def mark_awaiting_payment_or_cod(self, db: Session, *, order_id: int, amount: int, method: PaymentMethod):
        self._create_payment_record(db, order_id=order_id, amount=amount, method=method, status=PaymentStatus.PENDING)
        # Order status remains PENDING or could be set to CONFIRMED if COD is considered confirmed.
        # Usually COD means confirmed order, waiting for payment.
        # Let's set it to CONFIRMED for COD as well, or keep PENDING.
        # User requirement says "Order placed successfully. Payment on delivery."
        # Let's keep PENDING for now or CONFIRMED.
        # If I look at OrderStatus enum: PENDING, CONFIRMED, DELIVERING, DELIVERED, CANCELLED.
        # COD -> CONFIRMED seems appropriate as the order is valid and will be processed.
        order = crud_order.get(db, id=order_id)
        if order:
            order.status = OrderStatus.CONFIRMED.value
            db.add(order)
            
    def get_orders(self, db: Session, skip: int = 0, limit: int = 10) -> list[Order]:
        return crud_order.get_multi(db, skip=skip, limit=limit)
    
    def get_orders_by_user(self, db: Session, *, user_id: int, skip: int = 0, limit: int = 10) -> list[Order]:
        return crud_order.get_multi_by_user(db, user_id=user_id, skip=skip, limit=limit)

order_service = OrderService()