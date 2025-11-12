import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { Config } from "../config";
import { useAuthStore } from "../store/authStore";
import { mapAxiosErrorToApiProblem } from "../utils/apiProblem";
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

    // Clean logging: only show essential request details
    if (__DEV__) {
      const cleanRequest = {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        baseURL: config.baseURL,
      };
      logger.log("API Request:", cleanRequest);
    }

    return config;
  },
  (error) => {
    if (__DEV__) {
      logger.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 → refresh token → sign out on failure
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Clean logging: only show essential response details
    if (__DEV__) {
      const cleanResponse = {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        data: response.data,
      };
      logger.log("API Response:", cleanResponse);
    }
    return response;
  },
  async (error: AxiosError) => {
    // Map error to API problem
    const problem = mapAxiosErrorToApiProblem(error);

    // Handle authentication errors
    if (problem === "unauthorized") {
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
        if (__DEV__) {
          logger.error("Token refresh failed:", refreshError);
        }
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // For other errors, show toast if appropriate and let services handle
    // (services can override this behavior if needed)
    // Note: We don't show toast here to avoid duplication with service-level handling

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
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
      } else if (status >= 500) {
        // Server errors
        logger.error("Server error:", { status, data });
      }
    } else if (error.request) {
      // Network error - no response received
      logger.error("Network error - no response received:", error.request);
    } else {
      // Other error
      logger.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
