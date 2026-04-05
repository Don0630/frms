import { apiFetch } from "./apiFetch";


// ------------ FETCH ALL USER ------------
export async function fetchAllUser() {
  return apiFetch("/user/usersData");
}

// ------------ REGISTER USER ------------
export async function registerUser(userData) {
  const data = await apiFetch("/user/createUser", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  return data;
}