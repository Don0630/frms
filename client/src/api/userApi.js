// src/api/userApi.js
import api from "./api.js";

// ------------ FETCH ALL USERS ------------
export function fetchAllUser() {
  return api.get("/user/usersData");
}

// ------------ REGISTER USER ------------
export function registerUser(userData) {
  return api.post("/user/createUser", userData);
}

// ------------ UPDATE USER ------------
export function updateUser(userId, userData) {
  return api.put(`/user/updateUser/${userId}`, userData);
}

// ------------ DELETE USER ------------
export function deleteUser(id) {
  return api.delete(`/user/deleteUser/${id}`);
}