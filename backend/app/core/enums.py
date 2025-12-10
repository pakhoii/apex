import enum

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"
    
class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    DELIVERING = "delivering"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class OrderAction(str, enum.Enum):
    ADMIN_CONFIRM = "admin_confirm"
    ADMIN_SHIP = "admin_ship"
    USER_CONFIRM_DELIVERY = "user_confirm_delivery"
    CANCEL = "cancel"

class TestDriveStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    
class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    
class PaymentMethod(str, enum.Enum):
    CREDIT_CARD = "credit_card"
    BANK_TRANSFER = "bank_transfer"
    COD = "cash_on_delivery"