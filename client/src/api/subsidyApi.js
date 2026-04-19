// src/api/subsidyApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL SUBSIDY ------------
export async function fetchAllSubsidy() {
  return apiFetch("/subsidy/subsidiesData");
}

// ------------ ADD SUBSIDY ------------
export async function addSubsidy(subsidy) {
  const data = await apiFetch("/subsidy/addSubsidy", {
    method: "POST",
    body: JSON.stringify(subsidy),
  });

  return data.data;
}


// ------------ FETCH ALL FARMERS PER SUBSIDY ------------
export async function fetchAllFarmersPerSubsidy(distributionID) {
  return apiFetch(`/subsidy/subsidyData/${distributionID}/farmers`);
}


// ------------ FETCH AVAILABLE FARMER FOR SUBSIDY ------------
export async function fetchAvailableFarmer(distributionID, search = "") {
  const params = new URLSearchParams();

  if (distributionID != null) {
    params.append("distributionID", distributionID);
  }

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const url = `/subsidy/availableFarmer?${params.toString()}`;

  const res = await apiFetch(url);

  // normalize response
  return res?.data || res || [];
}


// ------------ ADD FARMER SUBSIDY ------------
export async function addFarmerSubsidy(subsidy) {
  const data = await apiFetch("/subsidy/addFarmerSubsidy", {
    method: "POST",
    body: JSON.stringify(subsidy),
  });

  return data.data;
}



// ------------ UPDATE DISTRIBUTE SUBSIDY ------------
export async function updateDistributeSubsidy(id, data) {
  const res = await apiFetch(
    `/subsidy/updateDistributeSubsidy/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return res.data;
}