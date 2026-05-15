// src/api/authApi.js
import api from "./api.js";

// ------------ LOGIN ------------
export async function login({ identifier, password }) {
  return api.post("/auth/login", { identifier, password });
}

// ------------ LOGOUT ------------
export async function logout() {
  return api.post("/auth/logout");
}