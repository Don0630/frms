const API_BASE = "http://localhost:5000";


export async function fetchAllStaff() {
  const token = localStorage.getItem("token"); // ✅ get token

  const res = await fetch(`${API_BASE}/staff/staffsData`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ attach token
    },
  });


    // ✅ check for expired token
  if (res.status === 401) {
    // Option 1: redirect to login
    window.location.href = "/login"; 
    // Option 2: attempt refresh token (if implemented)
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) throw new Error("Failed to fetch staff");

  return await res.json();
}


export async function addStaff(staff) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/staff/addStaff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(staff),
  });
  console.log(staff);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to add staff");
  }

  const data = await res.json();
  return data.data; // <-- return new staff object
}




export async function updateStaff(staff) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/staff/updateStaff/${staff.StaffID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(staff),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update staff");
  }

  const data = await res.json();
  return data.data;
}