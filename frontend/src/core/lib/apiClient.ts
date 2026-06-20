import axios, { type AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // If the request format itself is broken before leaving, catch it here
        return Promise.reject(error);
    }

)

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export abstract class BaseService {
  protected http: AxiosInstance = axiosInstance;
  
  protected async get<T>(url: string): Promise<T> {
    return this.http.get<any, T>(url);
  }

  protected async post<T>(url: string, data?: any): Promise<T> {
    return this.http.post<any, T>(url, data);
  }
}