// src/api/cropApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL CROP ------------
export async function fetchAllCrop() {
  return apiFetch("/crop/cropsData");
}



// ------------ ADD CROP ------------
export async function addCrop(crop) {
  return await apiFetch("/crop/addCrop", {
    method: "POST",
    body: JSON.stringify(crop),
  });
}



// ------------ UPDATE CROP ------------
export async function updateCrop(crop) {
  return await apiFetch(`/crop/updateCrop/${crop.CropID}`, {
    method: "PUT",
    body: JSON.stringify(crop),
  });
}


// ------------ FETCH SEARCHED CROP ------------
export async function fetchSearchCrop(search = "") {
  const url = search
    ? `/crop/searchCrop?search=${encodeURIComponent(search)}`
    : "/crop/searchCrop";

  return apiFetch(url);
}

 