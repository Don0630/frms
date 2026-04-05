// src/api/livestockApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL LIVESTOCK ------------
export async function fetchAllLivestock() {
  return apiFetch("/livestock/livestocksData");
}


