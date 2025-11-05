import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { Config } from "../config";
import { useAuthStore } from "../store/authStore";
import { logger } from "../utils/logger";
import { refresh } from "./auth/service";

// TODO: INJECT API_URL FROM Config.API_URL
// TODO: IMPLEMENT TOKEN RETRIEVAL FROM authStore
// TODO: IMPLEMENT TOKEN REFRESH LOGIC (authService.refresh())
// TODO: DISABLE LOGGING IN PRODUCTION

const api: AxiosInstance = axios.create({
  baseURL: Config.API_URL,
  timeout: Config.TIMEOUT,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // TODO: DEFINE token, refreshToken, setToken, signOut
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.log("Request:", config);
    return config;
  },
  (error) => {
    logger.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 → refresh token → sign out on failure
api.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.log("Response:", response);
    return response;
  },
  async (error: AxiosError) => {
    logger.error("Response error:", error);

    if (error.response?.status === 401) {
      const originalRequest = error.config;
      if (!originalRequest) {
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        await refresh();

        // Retry the original request with new token
        const newToken = useAuthStore.getState().token;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, sign out
        logger.error("Token refresh failed:", refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
