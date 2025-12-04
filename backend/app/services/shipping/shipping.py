class ShippingService:
    # Simple logic, simulate shipping cost calculation
    def quote_shipping_fee(self, *, shipping_address: str, subtotal: int) -> int:
        if subtotal > 1000000:
            return 0
        return 30000

shipping_service = ShippingService()