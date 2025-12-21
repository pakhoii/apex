import type { CancelOrderRequest, OrderCreate, OrderOut, OrderTransitionRequest } from "@/types/order";
import http from "./http";

export const createOrderApi = (orderData: OrderCreate) => {
    return http.post("/orders/", orderData).then(res => res.data);
};

export const transitionOrderStateApi = (orderId: number, request: OrderTransitionRequest) => {
    return http.patch(`/orders/${orderId}/transition`, request).then(res => res.data);
};

export const cancelOrderApi = (request: CancelOrderRequest) => {
    return http.post("/orders/cancel", request).then(res => res.data);
};

// User confirms delivery of their order
export const confirmDeliveryApi = (orderId: number) => {
    return http.patch(`/orders/${orderId}/confirm-delivery`).then(res => res.data);
};

// Get current user's orders
export const getMyOrdersApi = (skip: number = 0, limit: number = 10): Promise<OrderOut[]> => {
    return http.get("/orders/my", { params: { skip, limit } }).then(res => res.data);
};

// Admin: Get all orders
export const getAllOrdersApi = (skip: number = 0, limit: number = 100): Promise<OrderOut[]> => {
    return http.get("/orders/", { params: { skip, limit } }).then(res => res.data);
};
