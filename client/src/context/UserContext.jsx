// src/context/UserContext.jsx
import { createContext, useContext, useState } from "react";
import * as userApi from "../api/userApi.js";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);




  const [users, setUsers] = useState([]);

  

  // ------ LOAD USERS ------
  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: userData } = await userApi.fetchAllUser();

      console.log("👨‍🌾 Users fetched from API:", userData);

      if (success) {
        setUsers(userData);
      } else {
        setError("Failed to fetch user");
      }
    } catch (err) {
      console.error("⚠️ Error fetching user:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };





const createUser = async ({ staffId, username, password, role }) => {
  setLoading(true);
  setError(null);
  try {
    // pass all required fields to the API
    await userApi.registerUser({ staffId, username, password, role });
  } catch (err) {
    setError(err.message || "Failed to create user");
    throw err;
  } finally {
    setLoading(false);
  }
};

  return (
    <UserContext.Provider value={{ createUser, users, loadUsers, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);