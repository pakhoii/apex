import { useState } from "react";
import { 
    getMyCartApi,
    addItemToCartApi,
    updateCartItemApi,
    removeItemFromCartApi
} from "@/services/cart.api";
import type { CartItemCreate, CartItemUpdate } from "@/types/cart";

export const useCart = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const fetchMyCart = async () => {
        try {
            setLoading(true);
            setError(null);
            return await getMyCartApi();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const addItemToCart = async (payload: CartItemCreate) => {
        try {
            setLoading(true);
            setError(null);
            return await addItemToCartApi(payload);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const updateCartItem = async (model_id: number, payload: CartItemUpdate) => {
        try {
            setLoading(true);
            setError(null);
            return await updateCartItemApi(model_id, payload);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const removeItemFromCart = async (model_id: number) => {
        try {
            setLoading(true);
            setError(null);
            return await removeItemFromCartApi(model_id);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        fetchMyCart,
        addItemToCart,
        updateCartItem,
        removeItemFromCart,
        loading,
        error,
    };
}