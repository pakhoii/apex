import http from "./http";

export const loginApi = (payload: {
    email: string;
    password: string;
}) => {
    return http.post("/auth/login", payload).then(res => res.data);
};

export const registerApi = (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
}) => {
    return http.post("/auth/register", payload).then(res => res.data);
};
