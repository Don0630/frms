// src/context/StaffContext.jsx
import { createContext, useContext, useState } from "react";
import { fetchAllStaff as fetchAllStaffApi } from "../api/staffApi.js";

const StaffContext = createContext();

export function StaffProvider({ children }) {
  const staff = useProvideStaff();
  return <StaffContext.Provider value={staff}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  return useContext(StaffContext);
}

// --- Custom hook containing all staff logic ---
function useProvideStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [staff, setStaff] = useState([]);

  


// ------ STAFF ------
const loadStaff = async () => {
  setLoading(true);
  setError(null);

  try {
    const { success, data: staffData } = await fetchAllStaffApi();

    console.log("👨‍🌾 Staff fetched from API:", staffData);

    if (success) {
      setStaff(staffData);
    } else {
      setError("Failed to fetch staff");
    }

  } catch (err) {
    console.error("⚠️ Error fetching staff:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // Optional: clear staff data
  const clearStaff = () => {
    setStaff([]);
  };

  return {
    loading,
    error,
    staff,
    loadStaff,
    clearStaff,
  };
}

 