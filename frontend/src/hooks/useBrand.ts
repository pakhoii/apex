import { useState } from "react";
import { 
    createBrandApi,
    updateBrandApi,
    getAllBrandsApi,
    getBrandByIdApi,
    deleteBrandApi
} from "@/services/brand.api";

export const useBrand = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const createBrand = async (formData: FormData) => {
        try {
            setLoading(true);
            setError(null);
            return await createBrandApi(formData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateBrand = async (brandId: number, formData: FormData) => {
        try {
            setLoading(true);
            setError(null);
            return await updateBrandApi(brandId, formData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAllBrands = async () => {
        try {
            setLoading(true);
            setError(null);
            return await getAllBrandsApi();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchBrandById = async (brandId: number) => {
        try {
            setLoading(true);
            setError(null);
            return await getBrandByIdApi(brandId);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteBrand = async (brandId: number) => {
        try {
            setLoading(true);
            setError(null);
            return await deleteBrandApi(brandId);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createBrand,
        updateBrand,
        fetchAllBrands,
        fetchBrandById,
        deleteBrand,
        loading,
        error,
    };
};
