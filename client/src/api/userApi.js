const API_BASE = "http://localhost:5000";

export async function registerUser(userData) {
  const token = localStorage.getItem("token"); // ✅ get token

  const res = await fetch(`${API_BASE}/user/createUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ REQUIRED
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to register user");
  }

  return await res.json();
}