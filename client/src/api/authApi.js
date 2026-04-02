// client/src/api/authApi.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
 
 
// ------ LOGIN (username OR email) ------
export async function login({ identifier, password }) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
      credentials: "include", // include cookies for refresh token
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Extract values from data.data safely
    const { user = null, token = null } = data.data || {};

    return {
      success: true,
      message: data.message || "Login successful",
      user,        // { id, playerId }
      token,       // JWT access token 
    };
  } catch (err) {
    throw new Error(err.message || "Network error");
  }
} 



// ------ LOGOUT ------
export async function logout() {
  try {
    // Call backend to clear refresh token (if you store it in httpOnly cookie)
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // important to clear cookie
    });

    // Clear local storage token
    localStorage.removeItem("token");
    return { success: true };
  } catch (err) {
    console.error("Logout failed:", err);
    return { success: false, message: err.message };
  }
}