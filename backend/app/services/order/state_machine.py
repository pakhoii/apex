from app.core.enums import OrderStatus, OrderAction

# Define the transition rule for order state transition
# Format: (current_state, action) -> new_state
TRANSITION_RULES = {
    (OrderStatus.PENDING, OrderAction.ADMIN_CONFIRM): OrderStatus.CONFIRMED,
    (OrderStatus.PENDING, OrderAction.CANCEL): OrderStatus.CANCELLED,
    (OrderStatus.CONFIRMED, OrderAction.ADMIN_SHIP): OrderStatus.DELIVERING,
    (OrderStatus.CONFIRMED, OrderAction.CANCEL): OrderStatus.CANCELLED,
    (OrderStatus.DELIVERING, OrderAction.USER_CONFIRM_DELIVERY): OrderStatus.DELIVERED,
}


class InvalidTransitionError(Exception):
    def __init__(self, current_state: OrderStatus, action: OrderAction):
        self.current_state = current_state
        self.action = action
        super().__init__(f"Cannot perform action '{action.value}' on order with status '{current_state.value}'")


def handle_transition(current_state: OrderStatus, action: OrderAction) -> OrderStatus:
    new_state = TRANSITION_RULES.get((current_state, action))
    
    if not new_state:
        raise InvalidTransitionError(current_state, action)
    
    return new_state