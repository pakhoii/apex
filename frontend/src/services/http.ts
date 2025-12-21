import axios from "axios";

/**
 * Create an Axios instance with pre-configured base URL and default headers.
 */
const http = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Flag to track if the refresh token API is currently in progress
let isRefreshing = false;

// Queue to hold the Promises of pending requests while waiting for a new token
let failedQueue: any[] = [];

/**
 * Iterates through the failedQueue to resolve or reject pending requests.
 * @param error - The error object if refresh failed
 * @param token - The new access token if refresh succeeded
 */
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the Access Token from localStorage to every outgoing request.
 */
http.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * RESPONSE INTERCEPTOR
 * Handles automatic token refreshing when a 401 Unauthorized error occurs.
 */
http.interceptors.response.use(
    (response) => response, // Directly return successful responses
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is 401 (Unauthorized) and the request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Scenario A: A refresh is ALREADY in progress
            if (isRefreshing) {
                // Return a Promise that stays "pending" until processQueue is called
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then((token) => {
                    // Update header with the new token and retry the request
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return http(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            // Scenario B: This is the FIRST request to trigger a refresh
            originalRequest._retry = true; // Mark as retried to prevent infinite loops
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");

                // Call the API to get a new Access Token using the Refresh Token
                const { data } = await axios.post(
                    "http://127.0.0.1:8000/auth/refresh-token",
                    { refresh_token: refreshToken }
                );

                // Update new tokens in storage
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);

                // Resolve all other requests waiting in the queue
                processQueue(null, data.access_token);

                // Update the current (original) request's header and retry it
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return http(originalRequest);
                
            } catch (err) {
                // If refresh token is expired or invalid, reject the queue and logout
                processQueue(err, null);
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        // If error is not 401 or retry already failed, pass the error along
        return Promise.reject(error);
    }
);

export default http;