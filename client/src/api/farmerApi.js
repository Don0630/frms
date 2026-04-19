// src/api/farmerApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL FARMER ------------
export async function fetchAllFarmer() {
  return apiFetch("/farmer/farmersData");
}


// ------------ ADD FARMER ------------
export async function addFarmer(farmer) {
  const data = await apiFetch("/farmer/addFarmer", {
    method: "POST",
    body: JSON.stringify(farmer),
  });

  return data.data;
}



// ------------ UPDATE FARMER ------------
export async function updateFarmer(farmer) {
  const data = await apiFetch(`/farmer/updateFarmer/${farmer.FarmerID}`, {
    method: "PUT",
    body: JSON.stringify(farmer),
  });

  return data.data;
}



// ------------ ADD FARM ------------
export async function addFarm(farm) {
  const data = await apiFetch("/farmer/addFarm", {
    method: "POST",
    body: JSON.stringify(farm),
  });

  return data.data;
}



// ------------ UPDATE FARM ------------
export async function updateFarm(farm) {
  const data = await apiFetch(`/farmer/updateFarm/${farm.FarmID}`, {
    method: "PUT",
    body: JSON.stringify(farm),
  });

  return data.data;
}


// ------------ DELETE FARM ------------
export async function deleteFarm(id) {
  const data = await apiFetch(`/farmer/farm/${id}`, {
    method: "DELETE",
  });

  return data.data;
}



// ------------ FETCH SEARCHED FARMER ------------
export async function fetchSearchFarmers(search = "") {
  // Construct query parameters
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const url = `/farmer/searchFarmers?${params.toString()}`;
  return apiFetch(url);
}

 