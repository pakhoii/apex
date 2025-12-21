export type OrderStatus =
    | "pending"
    | "confirmed"
    | "delivering"
    | "delivered"
    | "cancelled"
    | "refunded";

export type OrderAction =
    | "admin_confirm"
    | "admin_ship"
    | "user_confirm_delivery"
    | "cancel";

export interface OrderItemCreate {
    model_id: number;
    quantity: number;
    unit_price: number;
}

export interface OrderCreate {
    shipping_address: string;
    items: OrderItemCreate[];
}

export interface OrderItemOut {
    model_id: number;
    quantity: number;
    unit_price: number;
}

export interface OrderOut {
    id: number;
    user_id: number;
    shipping_address: string;
    order_date: string;
    status: OrderStatus;
    items: OrderItemOut[];
}

export interface CancelOrderRequest {
    order_id: number;
}

export interface CancelOrderResponse {
    status: string;
    message?: string | null;
}

export interface OrderTransitionRequest {
    action: OrderAction;
}
