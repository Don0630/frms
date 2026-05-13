import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token); 
  const isAuthEndpoint = config.url?.startsWith("/auth");
  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Unwrap response + handle global errors
api.interceptors.response.use(
  (response) => response.data, // 👈 returns { success, message, data } directly
  (error) => {
    const status = error?.response?.status;
    if (status === 401) window.location.href = "/sessionexpired";
    if (status === 403) window.location.href = "/unauthorized";
    return Promise.reject(error);
  }
);

export default api;