import type { AdminUserCreate, UserOut, UserRoleUpdate, UserUpdateMe } from "@/types/user";
import http from "./http";

// Get current user information
export const getCurrentUserApi = (): Promise<UserOut> => {
    return http.get("/users/me").then(res => res.data);
};

// Update current user information
export const updateCurrentUserApi = (userData: UserUpdateMe): Promise<UserOut> => {
    return http.put("/users/me", userData).then(res => res.data);
};

// Admin: Update user role
export const updateUserRoleApi = (userId: number, roleData: UserRoleUpdate): Promise<UserOut> => {
    return http.put(`/users/${userId}/role`, roleData).then(res => res.data);
};

// Admin: Get all users (if endpoint exists)
export const getAllUsersApi = (): Promise<UserOut[]> => {
    return http.get("/users/").then(res => res.data);
};

// Admin: Create new user
export const createUserApi = (userData: AdminUserCreate): Promise<UserOut> => {
    return http.post("/admin/users/", userData).then(res => res.data);
};