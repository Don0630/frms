// src/api/staffApi.js
import api from "./api.js";

// ------------ FETCH ALL STAFF ------------
export async function fetchAllStaff() {
  return api.get("/staff/staffsData");
}

// ------------ ADD STAFF ------------
export async function addStaff(staff) {
  return api.post("/staff/addStaff", staff);
}

// ------------ UPDATE STAFF ------------
export async function updateStaff(staffId, staffData) {
  return api.put(`/staff/updateStaff/${staffId}`, staffData);
}


// ------------ DELETE STAFF ------------
export async function deleteStaff(id) {
  return api.delete(`/staff/deleteStaff/${id}`);
}


// ------------ FETCH AVAILABLE STAFF ------------
export async function fetchAvailableStaff(search = "") {
  return api.get("/staff/availableStaff", {
    params: { search },
  });
}