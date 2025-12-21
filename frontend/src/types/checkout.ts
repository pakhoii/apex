import type { CartItem } from "./cart";
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

export interface CheckoutItem extends CartItem {
    modelId?: number;
}

export interface CheckoutItemProps {
    item: CheckoutItem;
}

export interface CheckoutFormData {
    shippingAddress: string;
    paymentMethod: PaymentMethod;
}

export interface CheckoutFormProps {
    formData: CheckoutFormData;
    onFormChange: (data: CheckoutFormData) => void;
    loading?: boolean;
}

export interface CheckoutOrderSummaryProps {
    items: CheckoutItem[];
    subtotal: number;
    tax: number;
    total: number;
    onPlaceOrder: () => void;
    loading?: boolean;
}
