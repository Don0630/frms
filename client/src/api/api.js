import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

let refreshPromise = null; // shared across all requests

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (status === 401 && code === "NO_TOKEN" && !originalRequest._retry) {
      originalRequest._retry = true;

      // if a refresh is already in progress, wait for it
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/auth/refresh`,
            {},
            { withCredentials: true }
          )
          .finally(() => {
            refreshPromise = null; // reset after done
          });
      }

      try {
        await refreshPromise;
        return api(originalRequest); // retry original request
      } catch {
        window.location.href = "/sessionexpired";
        return Promise.reject(error);
      }
    }

    if (status === 401 && originalRequest._retry) {
      window.location.href = "/sessionexpired";
      return Promise.reject(error);
    }

    if (status === 403) {
      window.location.href = "/unauthorized";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;