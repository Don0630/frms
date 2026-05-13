// src/api/cropApi.js
import api from "./api.js";

// ------------ FETCH ALL CROP ------------
export async function fetchAllCrop() {
  return api.get("/crop/cropsData");
}

// ------------ ADD CROP ------------
export async function addCrop(crop) {
  return api.post("/crop/addCrop", crop);
}

// ------------ UPDATE CROP ------------
export async function updateCrop(crop) {
  return api.put(`/crop/updateCrop/${crop.CropID}`, crop);
}

// ------------ FETCH SEARCHED CROP ------------
export async function fetchSearchCrop(search = "") {
  return api.get("/crop/searchCrop", {
    params: { search },
  });
}