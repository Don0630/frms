// src/api/programApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL PROGRAMS ------------
export async function fetchAllProgram() {
  return apiFetch("/program/programsData");
}


// ------------ ADD PROGRAM ------------
export async function addProgram(program) {
  const data = await apiFetch("/program/addProgram", {
    method: "POST",
    body: JSON.stringify(program),
  });
  return data.data;
}



// ------------ UPDATE PROGRAM ------------
export async function updateProgram(program) {
  const data = await apiFetch(`/program/updateProgram/${program.ProgramID}`, {
    method: "PUT",
    body: JSON.stringify(program),
  });

  return data.data;
}




// ------------ FETCH AVAILABLE PROGRAM ------------
export async function fetchAvailableProgram(search = "") {
  // Optional search query
  const url = search
    ? `/program/availableProgram?search=${encodeURIComponent(search)}`
    : "/program/availableProgram";
  return apiFetch(url);
}

