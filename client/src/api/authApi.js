import { apiFetch } from "./apiFetch";

export async function login({ identifier, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export async function logout() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}