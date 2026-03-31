// src/api/userApi.js
const API_BASE = "http://localhost:5000";

/**
 * Register a staff as a user account
 * @param {Object} userData - { staffId: number, role: "admin" | "superadmin" }
 */
export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/user/createUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to register user");
  }

  return await res.json(); // could return { success: true, staffId: 1 }
}