const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

console.log("🌐 API BASE:", API_BASE);
console.log("➡️ CALLING:", `${API_BASE}${endpoint}`);

  const isAuthEndpoint =
    endpoint.startsWith("/auth/login") ||
    endpoint.startsWith("/auth");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      ...(token && !isAuthEndpoint
        ? { Authorization: `Bearer ${token}` }
        : {}),
      "Content-Type": "application/json",
    },
  });

  const data = await res.json().catch(() => null);

 

  if (!res.ok || data?.success === false) {
    const err = new Error(data?.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}