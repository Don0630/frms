// src/api/staffApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL STAFF ------------
export async function fetchAllStaff() {
  return apiFetch("/staff/staffsData");
}


// ------------ ADD STAFF ------------
export async function addStaff(staff) {
  return apiFetch("/staff/addStaff", {
    method: "POST",
    body: JSON.stringify(staff),
  });
}

 
// ------------ UPDATE STAFF ------------
export function updateStaff(staffId, staffData) {
  return apiFetch(`/staff/updateStaff/${staffId}`, {
    method: "PUT",
    body: JSON.stringify(staffData),
  });
}


// ------------ FETCH AVAILABLE STAFF ------------
export async function fetchAvailableStaff(search = "") {
  // Optional search query
  const url = search
    ? `/staff/availableStaff?search=${encodeURIComponent(search)}`
    : "/staff/availableStaff";
  return apiFetch(url);
}
