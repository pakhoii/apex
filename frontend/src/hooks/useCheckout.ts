import { useState } from "react";
import { 
    placeCheckoutApi,
    getCheckoutSummaryApi
} from "@/services/checkout.api";
import type { CheckoutRequest } from "@/types/checkout";

export const useCheckout = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const placeCheckout = async (request: CheckoutRequest) => {
        try {
            setLoading(true);
            setError(null);
            return await placeCheckoutApi(request);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchCheckoutSummary = async () => {
        try {
            setLoading(true);
            setError(null);
            return await getCheckoutSummaryApi();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        placeCheckout,
        fetchCheckoutSummary,
        loading,
        error,
    };
};
