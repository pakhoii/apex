from fastapi import HTTPException, status

from sqlalchemy.orm import Session
from app.schemas.checkout import CheckoutResponse, CheckoutRequest
from app.schemas.order import OrderCreate, OrderItemCreate

from app.services.cart.cart import cart_service
from app.services.shipping.shipping import shipping_service
from app.services.order.order import order_service
from app.services.checkout.payment_gateway import payment_gateway_service

from app.core.enums import PaymentMethod

class CheckoutService:
    def place_order(self, db: Session, *, user_id: int,
                    request_data: CheckoutRequest) -> CheckoutResponse:
        # Get summary of order
        summary = cart_service.get_summary(db, user_id=user_id)
        
        # Quote shipping cost
        shipping_fee = shipping_service.quote_shipping_fee(shipping_address=request_data.shipping_address,
                                                          subtotal=summary.subtotal)
        
        total_amount = int(summary.subtotal + shipping_fee)
        
        order_items_data = [
            OrderItemCreate(
                model_id=item.model_id,
                quantity=item.quantity,
                unit_price=item.unit_price
            )
            for item in summary.items
        ]
        
        order_data = OrderCreate(
            shipping_address=request_data.shipping_address,
            items=order_items_data
        )
        
        # Create order -> save to database
        try:
            order = order_service.create_order(db, user_id=user_id, order_data=order_data)
            cart_service.clear_cart(db, user_id=user_id)
            db.commit()
            db.refresh(order)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to create order: {str(e)}")

        
        try: 
            if request_data.payment_method == PaymentMethod.CREDIT_CARD:
                payment_token = "valid_token"
                charge_result = payment_gateway_service.charge(amount=total_amount, payment_token=payment_token)
                
                match charge_result:
                    case "success":
                        order_service.mark_paid(db, order_id=order.id, amount=total_amount, method=request_data.payment_method)
                        db.commit()
                        return CheckoutResponse(
                            order_id=order.id,
                            status="confirmed",
                            message="Payment successful and order confirmed."
                        )
                    case "pending":
                        order_service.mark_pending_payment(db, order_id=order.id, amount=total_amount, payment_method=request_data.payment_method)
                        db.commit()
                        return CheckoutResponse(
                            order_id=order.id,
                            status="pending",
                            message="Payment is pending. Your order will be processed once the payment is confirmed."
                        )
                    case "error":
                        order_service.mark_failed_payment(db, order_id=order.id, amount=total_amount, payment_method=request_data.payment_method)
                        db.commit()
                        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED,
                                            detail="Payment failed. Order has been cancelled.")
                    case "declined":
                        order_service.mark_failed_payment(db, order_id=order.id, amount=total_amount, payment_method=request_data.payment_method)
                        db.commit()
                        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED,
                                            detail="Payment was declined. Please check your payment details and try again.")
                        
            elif request_data.payment_method == PaymentMethod.COD:
                    order_service.mark_awaiting_payment_or_cod(db, order_id=order.id, amount=total_amount, method=request_data.payment_method)
                    db.commit()
                    return CheckoutResponse(order_id=order.id, status="orderPlaced", message="Order placed successfully. Payment on delivery.")
        except Exception as e:
            db.rollback()
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred during payment processing: {str(e)}")

        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payment method.")

checkout_service = CheckoutService()     
                