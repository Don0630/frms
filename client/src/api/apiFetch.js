// src/api/apiFetch.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // Add headers
  options.headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE}${endpoint}`, options);

  // ✅ Check for expired token
  if (res.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("token"); // optional: clear token
    window.location.href = "/sessionexpired";   // redirect to sessionexpired
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API request failed");
  }

  return res.json();
}