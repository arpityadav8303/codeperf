import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";
import { API_BASE_URL } from "./apiConfig";


const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let isRefreshing = false;
let refreshSubscribers: ((newToken: string) => void)[] = [];

function subscribeTokenRefresh(cb: (newToken: string) => void) {
    refreshSubscribers.push(cb);
}

function onRefreshed(newToken: string) {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        const isUnauthorized = error.response?.status === 401;
        const isAuthRoute = originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/register");

        if (isUnauthorized && !originalRequest._retry && !isAuthRoute) {
            const refreshToken = tokenStorage.getRefreshToken();

            if (!refreshToken) {
                tokenStorage.clearTokens();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newAccessToken: string) => {
                        originalRequest.headers = {
                            ...originalRequest.headers,
                            Authorization: `Bearer ${newAccessToken}`,
                        };
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                tokenStorage.setTokens(newAccessToken, newRefreshToken);
                onRefreshed(newAccessToken);

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                tokenStorage.clearTokens();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export class BaseService {
    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.get<T>(url, config);
        return response.data;
    }

    protected async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.post<T>(url, body, config);
        return response.data;
    }

    protected async put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.put<T>(url, body, config);
        return response.data;
    }

    protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await axiosInstance.delete<T>(url, config);
        return response.data;
    }
}

export default axiosInstance;

