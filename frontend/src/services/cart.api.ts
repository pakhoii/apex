import http from "./http";
import type { CartItemCreate, CartItemUpdate } from "@/types/cart";

export const getMyCartApi = () => {
    return http.get("/cart/").then(res => res.data);
};

export const addItemToCartApi = (payload: CartItemCreate) => {
    return http.post("/cart/items", payload).then(res => res.data);
};

export const updateCartItemApi = (model_id: number, payload: CartItemUpdate) => {
    return http.put(`/cart/items/${model_id}`, payload).then(res => res.data);
};

export const removeItemFromCartApi = (model_id: number) => {
    return http.delete(`/cart/items/${model_id}`).then(res => res.data);
};