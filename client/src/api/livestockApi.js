// src/api/livestockApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL LIVESTOCK ------------
export async function fetchAllLivestock() {
  return apiFetch("/livestock/livestocksData");
}


// ------------ ADD LIVESTOCK ------------
export async function addLivestock(livestock) {
return await apiFetch("/livestock/addLivestock", {
    method: "POST",
    body: JSON.stringify(livestock),
  });
}



// ------------ UPDATE LIVESTOCK ------------
export async function updateLivestock(livestock) {
return await apiFetch(`/livestock/updateLivestock/${livestock.LivestockID}`, {
    method: "PUT",
    body: JSON.stringify(livestock),
  });
}




// ------------ FETCH SEARCHED LIVESTOCK ------------
export async function fetchSearchLivestock(search = "") {
  const url = search
    ? `/livestock/searchLivestock?search=${encodeURIComponent(search)}`
    : "/livestock/searchLivestock";

  return apiFetch(url);
}