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

class OrderAction(str, enum.Enum):
    ADMIN_CONFIRM = "admin_confirm"
    ADMIN_SHIP = "admin_ship"
    USER_CONFIRM_DELIVERY = "user_confirm_delivery"
    CANCEL = "cancel"