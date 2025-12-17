import type { OrderItemOut } from "./order";

export type PaymentMethod =
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "cash";

export interface CheckoutSummary {
    items: OrderItemOut[];
    subtotal: number;
}

export interface CheckoutRequest {
    shipping_address: string;
    payment_method: PaymentMethod;
}

export interface CheckoutResponse {
    order_id: number;
    status: string;
    message: string;
}
