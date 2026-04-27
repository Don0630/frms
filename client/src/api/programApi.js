// src/api/programApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL PROGRAMS ------------
export async function fetchAllProgram() {
  return apiFetch("/program/programsData");
}


// ------------ ADD PROGRAM ------------
export async function addProgram(program) {
  return await apiFetch("/program/addProgram", {
    method: "POST",
    body: JSON.stringify(program),
  });
}



// ------------ UPDATE PROGRAM ------------
export async function updateProgram(program) {
  return await apiFetch(`/program/updateProgram/${program.ProgramID}`, {
    method: "PUT",
    body: JSON.stringify(program),
  });
}




// ------------ FETCH AVAILABLE PROGRAM ------------
export async function fetchAvailableProgram(search = "") {
  // Optional search query
  const url = search
    ? `/program/availableProgram?search=${encodeURIComponent(search)}`
    : "/program/availableProgram";
  return apiFetch(url);
}

