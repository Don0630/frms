// src/api/programApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL PROGRAMS ------------
export async function fetchAllProgram() {
  return apiFetch("/program/programsData");
}

 