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


 

// ------------ FETCH AVAILABLE FARMER ------------
export async function fetchAvailableFarmer(distributionID, search = "") {
  // Construct query parameters
  const params = new URLSearchParams();
  if (distributionID) params.append("distributionID", distributionID);
  if (search) params.append("search", search);

  const url = `/farmer/availableFarmer?${params.toString()}`;
  return apiFetch(url);
}

 