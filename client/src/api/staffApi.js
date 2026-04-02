const API_BASE = "http://localhost:5000";

export async function fetchAllStaff() {
  const token = localStorage.getItem("token"); // ✅ get token

  const res = await fetch(`${API_BASE}/staff/staffsData`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ attach token
    },
  });

  if (!res.ok) throw new Error("Failed to fetch staff");

  return await res.json();
}