from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.order import Order
from app.models.payment import Payment
from app.core.enums import OrderStatus, PaymentStatus
from app.schemas.order_cancel import CancelOrderResponse

class PaymentGateway:
    @staticmethod
    def refund(order: Order) -> bool:
        # Mock implementation: always return True for now
        return True

class NotificationService:
    @staticmethod
    def publish(event: str, order: Order):
        # Mock implementation: do nothing
        pass

class OrderCancelService:
    def cancel_order(self, db: Session, order_id: int) -> CancelOrderResponse:
        # STEP A — Load order
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Check eligibility
        # For this implementation, we assume orders that are already delivered or cancelled are not eligible
        if order.status in [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.REFUNDED]:
             return CancelOrderResponse(status="not_eligible", message="Order cannot be cancelled in its current state")

        # Check payment status
        # We look for a successful payment associated with the order
        paid_payment = db.query(Payment).filter(
            Payment.order_id == order.id, 
            Payment.status == PaymentStatus.PAID
        ).first()

        if paid_payment:
            # STEP B — If PAID
            refund_success = PaymentGateway.refund(order)
            if refund_success:
                order.status = OrderStatus.REFUNDED
                # Also update payment status if needed, but requirements just say update order status
                db.commit()
                db.refresh(order)
                NotificationService.publish("Refunded", order)
                return CancelOrderResponse(status="refunded", message="Order refunded successfully")
            else:
                return CancelOrderResponse(status="refund_failed", message="Refund processing failed")
        else:
            # STEP C — If NOT PAID
            order.status = OrderStatus.CANCELLED
            db.commit()
            db.refresh(order)
            return CancelOrderResponse(status="cancelled", message="Order cancelled successfully")

order_cancel_service = OrderCancelService()
