// src/api/livestockApi.js
import api from "./api.js";

// ------------ FETCH ALL LIVESTOCK ------------
export async function fetchAllLivestock() {
  return api.get("/livestock/livestocksData");
}

// ------------ ADD LIVESTOCK ------------
export async function addLivestock(livestock) {
  return api.post("/livestock/addLivestock", livestock);
}

// ------------ UPDATE LIVESTOCK ------------
export async function updateLivestock(livestock) {
  return api.put(`/livestock/updateLivestock/${livestock.LivestockID}`, livestock);
}

// ------------ DELETE LIVESTOCK ------------
export async function deleteLivestock(id) {
  return api.delete(`/livestock/deleteLivestock/${id}`);
}

// ------------ FETCH SEARCHED LIVESTOCK ------------
export async function fetchSearchLivestock(search = "") {
  return api.get("/livestock/searchLivestock", {
    params: { search },
  });
}