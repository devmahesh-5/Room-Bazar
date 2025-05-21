import axios from "axios";
import authService from "./auth.services.js";
const api = axios.create({
    baseURL: "http://localhost:5173",
    withCredentials: true,
    timeout: 10000
});

api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config;
        if (error?.response?.status === 401 && !originalRequest._retryoriginalRequest.retryCount < 3) {
            originalRequest._retry = true;
            originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;
            originalRequest._retry = true;
            try {
                await authService.refreshAccessToken();
                return api(originalRequest);
            } catch (refreshError) {
                window.location.href = '/users/login';
                return Promise.reject(refreshError);
            }

        }

        return Promise.reject(error);
    }
)

export default api;