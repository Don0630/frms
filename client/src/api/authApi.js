// src/api/authApi.js
import api from "./api.js";

// ------------ LOGIN ------------
export async function login({ identifier, password }) {
  return api.post("/auth/login", { identifier, password });
}

// ------------ FETCH CURRENT USER ------------
export async function user() {
  return api.get("/auth/user");
}


// ------------ LOGOUT ------------
export async function logout() {
  return api.post("/auth/logout");
}


