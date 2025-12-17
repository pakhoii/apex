import http from "./http";
import type { CheckoutRequest } from "@/types/checkout";

export const placeCheckoutApi = (request: CheckoutRequest) => {
    return http.post("/checkout/", request).then(res => res.data);
};

export const getCheckoutSummaryApi = () => {
    return http.get("/checkout/summary").then(res => res.data);
};
