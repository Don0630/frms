import api from "./api.js";

// ------------ FETCH ALL FARMER ------------
export async function fetchAllFarmer() {
  return api.get("/farmer/farmersData");
}

// ------------ ADD FARMER ------------
export async function addFarmer(farmer) {
  return api.post("/farmer/addFarmer", farmer);
}

// ------------ UPDATE FARMER ------------
export async function updateFarmer(farmer) {
  return api.put(`/farmer/updateFarmer/${farmer.FarmerID}`, farmer);
}

// ------------ ADD FARM ------------
export async function addFarm(farm) {
  return api.post("/farmer/addFarm", farm);
}

// ------------ UPDATE FARM ------------
export async function updateFarm(farm) {
  return api.put(`/farmer/updateFarm/${farm.FarmID}`, farm);
}

// ------------ DELETE FARM ------------
export async function deleteFarm(id) {
  return api.delete(`/farmer/farm/${id}`);
}

// ------------ FETCH SEARCHED FARMER ------------
export async function fetchSearchFarmer(search = "") {
  return api.get("/farmer/searchFarmer", {
    params: { search }, // 👈 axios handles query params cleanly
  });
}

// ------------ FETCH FARMER BY ID ------------
export async function fetchFarmerById(id) {
  return api.get(`/farmer/farmerById/${id}`);
}