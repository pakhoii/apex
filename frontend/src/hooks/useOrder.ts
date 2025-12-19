import { useState } from "react";
import { 
    createOrderApi,
    transitionOrderStateApi,
    cancelOrderApi
} from "@/services/order.api";
import type { OrderCreate, CancelOrderRequest, OrderTransitionRequest } from "@/types/order";

export const useOrder = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const createOrder = async (orderData: OrderCreate) => {
        try {
            setLoading(true);
            setError(null);
            return await createOrderApi(orderData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const transitionOrderState = async (orderId: number, request: OrderTransitionRequest) => {
        try {
            setLoading(true);
            setError(null);
            return await transitionOrderStateApi(orderId, request);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (request: CancelOrderRequest) => {
        try {
            setLoading(true);
            setError(null);
            return await cancelOrderApi(request);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createOrder,
        transitionOrderState,
        cancelOrder,
        loading,
        error,
    };
};
