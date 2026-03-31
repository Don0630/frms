// src/context/UserContext.jsx
import { createContext, useContext, useState } from "react";
import { registerUser } from "../api/userApi.js";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const createUser = async ({ staffId, username, password, role }) => {
  setLoading(true);
  setError(null);
  try {
    // pass all required fields to the API
    await registerUser({ staffId, username, password, role });
  } catch (err) {
    setError(err.message || "Failed to create user");
    throw err;
  } finally {
    setLoading(false);
  }
};

  return (
    <UserContext.Provider value={{ createUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);