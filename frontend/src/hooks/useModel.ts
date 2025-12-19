import { useState } from "react";
import { 
    getModelDetailsApi, 
    getModelsApi,
    createModelApi,
    updateModelApi,
    compareModelsApi
} from "@/services/model.api";

import type { 
    ModelFilterParams, 
    PaginationParams, 
    ModelCompareParams 
} from "@/types/model";

export const useModel = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchModels = async (filters?: ModelFilterParams, pagination?: PaginationParams) => {
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

    const updateModel = async (modelId: number, formData: FormData) => {
        try {
            setLoading(true);
            setError(null);
            return await updateModelApi(modelId, formData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const createModel = async (formData: FormData) => {
        try {
            setLoading(true);
            setError(null);
            return await createModelApi(formData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const compareModels = async (params: ModelCompareParams) => {
        try {
            setLoading(true);
            setError(null);
            return await compareModelsApi(params);
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
        updateModel,
        createModel,
        compareModels,
        loading,
        error,
    };
};
