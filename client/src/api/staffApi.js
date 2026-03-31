// src/services/staffService.js
const API_BASE = "http://localhost:5000";

export async function fetchAllStaff() {
  const res = await fetch(`${API_BASE}/staff/staffsData`);
  if (!res.ok) throw new Error("Failed to fetch staff");
  return await res.json();
}



