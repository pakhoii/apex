import http from "./http";

export const createBrandApi = (formData: FormData) => {
    return http.post("/brands/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(res => res.data);
};

export const updateBrandApi = (brandId: number, formData: FormData) => {
    return http.patch(`/brands/${brandId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(res => res.data);
};
