// src/api/livestockApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL LIVESTOCK ------------
export async function fetchAllLivestock() {
  return apiFetch("/livestock/livestocksData");
}


// ------------ ADD LIVESTOCK ------------
export async function addLivestock(livestock) {
  const data = await apiFetch("/livestock/addLivestock", {
    method: "POST",
    body: JSON.stringify(livestock),
  });

  return data.data;
}
