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



// ------------ UPDATE LIVESTOCK ------------
export async function updateLivestock(livestock) {
  const data = await apiFetch(`/livestock/updateLivestock/${livestock.LivestockID}`, {
    method: "PUT",
    body: JSON.stringify(livestock),
  });

  return data.data;
}




// ------------ FETCH SEARCHED LIVESTOCK ------------
export async function fetchSearchLivestock(search = "") {
  // Construct query parameters
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const url = `/livestock/searchLivestock?${params.toString()}`;
  return apiFetch(url);
}

