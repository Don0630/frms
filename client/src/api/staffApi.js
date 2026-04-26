// src/api/staffApi.js
import { apiFetch } from "./apiFetch.js";

// ------------ FETCH ALL STAFF ------------
export async function fetchAllStaff() {
  return apiFetch("/staff/staffsData");
}

// ------------ ADD STAFF ------------
export async function addStaff(staff) {
  if (!staff) {
    console.error("❌ addStaff: staff payload is missing");
    throw new Error("Staff payload is required");
  }

  console.log("📤 addStaff payload:", staff);

  return apiFetch("/staff/addStaff", {
    method: "POST",
    body: JSON.stringify(staff),
  });
}

// ------------ UPDATE STAFF ------------
export async function updateStaff(staffId, staffData) {
  // Debugging validations
  if (!staffId) {
    console.error("❌ updateStaff: staffId is missing", { staffId });
    throw new Error("Staff ID is required");
  }

  if (!staffData) {
    console.error("❌ updateStaff: staffData is missing", { staffData });
    throw new Error("Staff data is required");
  }

  console.log("📤 updateStaff ID:", staffId);
  console.log("📤 updateStaff payload:", staffData);

  return apiFetch(`/staff/updateStaff/${staffId}`, {
    method: "PUT",
    body: JSON.stringify(staffData),
  });
}

// ------------ FETCH AVAILABLE STAFF ------------
export async function fetchAvailableStaff(search = "") {
  const url = search
    ? `/staff/availableStaff?search=${encodeURIComponent(search)}`
    : "/staff/availableStaff";

  console.log("📥 fetchAvailableStaff URL:", url);

  return apiFetch(url);
}