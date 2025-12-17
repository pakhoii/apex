export type UserRole = "user" | "admin";

/* ========= BASE ========= */
export interface User {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

/* ========= CREATE / UPDATE ========= */
export interface UserCreate extends User {
    password: string;
}

export interface UserUpdate {
    first_name?: string;
    last_name?: string;
    password?: string;
}

export interface UserUpdateMe {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
}

/* ========= AUTH ========= */
export interface UserLogin {
    email: string;
    password: string;
}

export interface OtpVerify {
    otp_code: string;
    pending_token: string;
}

export interface UserResetPassword {
    email: string;
    new_password: string;
}

/* ========= ADMIN ========= */
export interface AdminUserCreate extends UserCreate {
    role?: UserRole;
}

export interface UserRoleUpdate {
    role: UserRole;
}

/* ========= RESPONSE ========= */
export interface UserOut extends User {
    id: number;
    is_2fa_enabled: boolean;
    role: UserRole;
}
