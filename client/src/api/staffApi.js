// src/api/staffApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL STAFF ------------
export async function fetchAllStaff() {
  return apiFetch("/staff/staffsData");
}


// ------------ ADD STAFF ------------
export async function addStaff(staff) {
  const data = await apiFetch("/staff/addStaff", {
    method: "POST",
    body: JSON.stringify(staff),
  });

  return data.data;
}


// ------------ UPDATE STAFF ------------
export async function updateStaff(staff) {
  const data = await apiFetch(`/staff/updateStaff/${staff.StaffID}`, {
    method: "PUT",
    body: JSON.stringify(staff),
  });

  return data.data;
}


// ------------ FETCH AVAILABLE STAFF ------------
export async function fetchAvailableStaff(search = "") {
  // Optional search query
  const url = search
    ? `/staff/availableStaff?search=${encodeURIComponent(search)}`
    : "/staff/availableStaff";
  return apiFetch(url);
}
