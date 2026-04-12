// src/api/subsidyApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL SUBSIDY DETAILS ------------
export async function fetchAllSubsidyDetails() {
  return apiFetch("/subsidydetails/subsidyDetailsData");
}


// ------------ FETCH ALL FARMERS PER SUBSIDY ------------
export async function fetchAllFarmersPerSubsidy(distributionID) {
  return apiFetch(`/subsidydetails/subsidyDetailsData/${distributionID}/farmers`);
}




// ------------ FETCH AVAILABLE FARMER FOR SUBSIDY ------------
export async function fetchAvailableFarmer(distributionID, search = "") {
  // Construct query parameters
  const params = new URLSearchParams();
  if (distributionID) params.append("distributionID", distributionID);
  if (search) params.append("search", search);

  const url = `/subsidydetails/availableFarmer?${params.toString()}`;
  return apiFetch(url);
}


// ------------ ADD FARMER SUBSIDY ------------
export async function addFarmerSubsidy(subsidydetails) {
  const data = await apiFetch("/subsidydetails/addFarmerSubsidy", {
    method: "POST",
    body: JSON.stringify(subsidydetails),
  });

  return data.data;
}



// ------------ UPDATE DISTRIBUTE SUBSIDY ------------
export async function updateDistributeSubsidy(id, data) {
  const res = await apiFetch(
    `/subsidydetails/updateDistributeSubsidy/${id}`,
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