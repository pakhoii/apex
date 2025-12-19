import { useState } from "react";
import { getModelDetailsApi, getModelsApi } from "@/services/model.api";

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

    const fetchModelsDetails = async (modelId: number) => {
        try {
            setLoading(true);
            setError(null);
            return await getModelDetailsApi(modelId);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        fetchModels,
        fetchModelsDetails,
        loading,
        error,
    };
};
