import http from "./http";
import type { ModelFilterParams, PaginationParams, ModelCompareParams } from "@/types/model";

export const createModelApi = (formData: FormData) => {
    return http.post("/models/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(res => res.data);
};

export const updateModelApi = (modelId: number, formData: FormData) => {
    return http.patch(`/models/${modelId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(res => res.data);
};

export const getModelsApi = (filters?: ModelFilterParams, pagination?: PaginationParams) => {
    const params = {
        ...filters,
        ...pagination
    };
    return http.get("/models/", { params }).then(res => res.data);
};

export const getModelDetailsApi = (modelId: number) => {
    return http.get(`/models/${modelId}`).then(res => res.data);
};

export const compareModelsApi = (params: ModelCompareParams) => {
    return http.post("/models/compare", params).then(res => res.data);
};
