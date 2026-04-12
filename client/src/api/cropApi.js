// src/api/cropApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL CROP ------------
export async function fetchAllCrop() {
  return apiFetch("/crop/cropsData");
}



// ------------ ADD CROP ------------
export async function addCrop(crop) {
  const data = await apiFetch("/crop/addCrop", {
    method: "POST",
    body: JSON.stringify(crop),
  });

  return data.data;
}



// ------------ FETCH SEARCHED CROP ------------
export async function fetchSearchCrops(search = "") {
  // Construct query parameters
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const url = `/crop/searchCrops?${params.toString()}`;
  return apiFetch(url);
}

 