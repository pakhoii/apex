import { useState } from "react";
import { getModelsApi } from "@/services/model.api";

export const useModel = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchModels = async (filters?: any, pagination?: any) => {
        try {
            setLoading(true);
            setError(null);
            return await getModelsApi(filters, pagination);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchModels,
        loading,
        error,
    };
};
