// src/context/ProgramContext.jsx
import { createContext, useContext, useState } from "react";
import * as programApi from "../api/programApi.js";

const ProgramContext = createContext();

export function ProgramProvider({ children }) {
  const program = useProvideProgram();
  return <ProgramContext.Provider value={program}>{children}</ProgramContext.Provider>;
}

export function useProgram() {
  return useContext(ProgramContext);
}

// --- Custom hook containing all program logic ---
function useProvideProgram() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [program, setProgram] = useState([]);

  // ------ LOAD ALL PROGRAM ------
  const loadProgram = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: programData } = await programApi.fetchAllProgram();
      console.log("👨‍🌾 Program fetched from API:", programData);

      if (success) {
        setProgram(programData);
      } else {
        setError("Failed to fetch program");
      }
    } catch (err) {
      console.error("⚠️ Error fetching program:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 

  // ------ CLEAR PROGRAM STATE ------
  const clearProgram = () => setProgram([]);

  return {
    loading,
    error,
    program,
    loadProgram,
    clearProgram,
  };
}