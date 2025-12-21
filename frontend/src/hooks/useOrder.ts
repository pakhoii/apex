import {
    cancelOrderApi,
    confirmDeliveryApi,
    createOrderApi,
    getAllOrdersApi,
    getMyOrdersApi,
    transitionOrderStateApi
} from "@/services/order.api";
import type { CancelOrderRequest, OrderCreate, OrderOut, OrderTransitionRequest } from "@/types/order";
import { useState } from "react";

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

    const confirmDelivery = async (orderId: number) => {
        try {
            setLoading(true);
            setError(null);
            return await confirmDeliveryApi(orderId);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyOrders = async (skip: number = 0, limit: number = 10): Promise<OrderOut[]> => {
        try {
            setLoading(true);
            setError(null);
            return await getMyOrdersApi(skip, limit);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAllOrders = async (skip: number = 0, limit: number = 100): Promise<OrderOut[]> => {
        try {
            setLoading(true);
            setError(null);
            return await getAllOrdersApi(skip, limit);
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
        confirmDelivery,
        fetchMyOrders,
        fetchAllOrders,
        loading,
        error,
    };
};
