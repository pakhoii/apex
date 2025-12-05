import random
from typing import Literal

class PaymentGatewayService:
    # Simulate payment processing
    def charge(self, *, amount: int, payment_token: str)-> Literal["success", "declined", "pending", "error"]:
        if "error" in payment_token:
            return "error"
        
        if "pending" in payment_token:
            return "pending"
        
        # 80% chance of success and 20% chance of decline
        return "success" if random.random() < 0.8 else "declined"
    
    
payment_gateway_service = PaymentGatewayService()