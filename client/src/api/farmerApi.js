// src/api/farmerApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL FARMER ------------
export async function fetchAllFarmer() {
  return apiFetch("/farmer/farmersData");
}


// ------------ ADD FARMER ------------
export async function addFarmer(farmer) {
  return await apiFetch("/farmer/addFarmer", {
    method: "POST",
    body: JSON.stringify(farmer),
  });
}



// ------------ UPDATE FARMER ------------
export async function updateFarmer(farmer) {
  return await apiFetch(`/farmer/updateFarmer/${farmer.FarmerID}`, {
    method: "PUT",
    body: JSON.stringify(farmer),
  });
}



// ------------ ADD FARM ------------
export async function addFarm(farm) {
  return await apiFetch("/farmer/addFarm", {
    method: "POST",
    body: JSON.stringify(farm),
  });
}



// ------------ UPDATE FARM ------------
export async function updateFarm(farm) {
  return await apiFetch(`/farmer/updateFarm/${farm.FarmID}`, {
    method: "PUT",
    body: JSON.stringify(farm),
  });
}


// ------------ DELETE FARM ------------
export async function deleteFarm(id) {
  return await apiFetch(`/farmer/farm/${id}`, {
    method: "DELETE",
  });
}



// ------------ FETCH SEARCHED FARMER ------------
export async function fetchSearchFarmer(search = "") {
  const url = search
    ? `/farmer/searchFarmer?search=${encodeURIComponent(search)}`
    : "/farmer/searchFarmer";

  return apiFetch(url);
}

 
// ------------ FETCH FARMER BY ID------------
 export async function fetchFarmerById(id) {
  return apiFetch(`/farmer/farmerById/${id}`);
}