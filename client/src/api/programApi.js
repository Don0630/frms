// src/api/programApi.js
import api from "./api.js";

// ------------ FETCH ALL PROGRAMS ------------
export async function fetchAllProgram() {
  return api.get("/program/programsData");
}

// ------------ ADD PROGRAM ------------
export async function addProgram(program) {
  return api.post("/program/addProgram", program);
}

// ------------ UPDATE PROGRAM ------------
export async function updateProgram(program) {
  return api.put(`/program/updateProgram/${program.ProgramID}`, program);
}

// ------------ DELETE PROGRAM ------------
export async function deleteProgram(id) {
  return api.delete(`/program/deleteProgram/${id}`);
}

// ------------ FETCH AVAILABLE PROGRAM ------------
export async function fetchAvailableProgram(search = "") {
  return api.get("/program/availableProgram", {
    params: { search },
  });
}