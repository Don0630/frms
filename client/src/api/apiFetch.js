const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  const data = await res.json().catch(() => null);

  // 1. handle auth
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/sessionexpired";
    throw new Error("Session expired");
  }

  // 2. handle errors (backend or HTTP)
  if (!res.ok || data?.success === false) {
    const err = new Error(data?.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  // 3. return FULL backend response
  return data;
}