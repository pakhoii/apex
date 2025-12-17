import http from "./http";
import type { OrderCreate, CancelOrderRequest, OrderTransitionRequest } from "@/types/order";

export const createOrderApi = (orderData: OrderCreate) => {
    return http.post("/orders/", orderData).then(res => res.data);
};

export const transitionOrderStateApi = (orderId: number, request: OrderTransitionRequest) => {
    return http.patch(`/orders/${orderId}/transition`, request).then(res => res.data);
};

export const cancelOrderApi = (request: CancelOrderRequest) => {
    return http.post("/orders/cancel", request).then(res => res.data);
};
