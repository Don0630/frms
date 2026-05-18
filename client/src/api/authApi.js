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


// ------------ ME ------------
export async function me() {
  const res = await api.get("/auth/me");
  return res.data.user;
}