import { useState } from "react";
import { loginApi, registerApi } from "@/services/auth.api";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveToken = (data: any) => {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
    };
    
    const navigate = useNavigate();

    const login = async (payload: {
        email: string;
        password: string;
    }) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await loginApi(payload);
            saveToken(data);
            navigate("/dashboard");
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (payload: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        password: string;
    }) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await registerApi({
                first_name: payload.firstName,
                last_name: payload.lastName,
                email: payload.email,
                phone_number: payload.phoneNumber,
                password: payload.password,
            });
            saveToken(data);
            navigate("/dashboard");
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return {
        login,
        register,
        logout,
        isLoading,
        error,
    };
};