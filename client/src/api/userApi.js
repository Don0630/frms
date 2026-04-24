import { apiFetch } from "./apiFetch";

// ------------ FETCH ALL USER ------------
export function fetchAllUser() {
  return apiFetch("/user/usersData");
}

// ------------ REGISTER USER ------------
export function registerUser(userData) {
  return apiFetch("/user/createUser", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}


// ------------ UPDATE USER ------------
export function updateUser(userId, userData) {
  return apiFetch(`/user/updateUser/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}


export function deleteUser(id) {
  return apiFetch(`/user/deleteUser/${id}`, {
    method: "DELETE",
  });
}