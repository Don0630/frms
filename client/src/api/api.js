import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true, // sends cookies automatically
});

// no request interceptor needed — cookie is sent automatically

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const originalRequest = error.config;

    // retry on token expired (401) or invalid token (403)
    if (
      (status === 401 || status === 403) &&
      code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch {
        window.location.href = "/sessionexpired";
      }
    }

    if (status === 403 && code !== "TOKEN_EXPIRED") {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  }
);
export default api;