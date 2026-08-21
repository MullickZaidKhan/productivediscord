import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.get("auth/refresh");
        return api(originalRequest);
      } catch (err) {
        // No redirect here. Just let the rejection propagate.
        // useAccessToken() will resolve to isError: true,
        // useAuthStatus() will resolve to "unauthenticated",
        // and ProtectedRoute/PublicRoute handle the redirect via <Navigate>.
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
