import {
    createUserApi,
    getAllUsersApi,
    getCurrentUserApi,
    updateCurrentUserApi,
    updateUserRoleApi,
} from "@/services/user.api";
import type { AdminUserCreate, UserOut, UserRoleUpdate, UserUpdateMe } from "@/types/user";
import { useState } from "react";

export const useUser = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getCurrentUser = async (): Promise<UserOut> => {
        try {
            setLoading(true);
            setError(null);
            return await getCurrentUserApi();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCurrentUser = async (userData: UserUpdateMe): Promise<UserOut> => {
        try {
            setLoading(true);
            setError(null);
            return await updateCurrentUserApi(userData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: number, roleData: UserRoleUpdate): Promise<UserOut> => {
        try {
            setLoading(true);
            setError(null);
            return await updateUserRoleApi(userId, roleData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAllUsers = async (): Promise<UserOut[]> => {
        try {
            setLoading(true);
            setError(null);
            return await getAllUsersApi();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData: AdminUserCreate): Promise<UserOut> => {
        try {
            setLoading(true);
            setError(null);
            return await createUserApi(userData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        getCurrentUser,
        updateCurrentUser,
        updateUserRole,
        getAllUsers,
        createUser,
        loading,
        error,
    };
};
