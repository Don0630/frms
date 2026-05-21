// src/hooks/useAvailableProgram.js
import { useQuery } from "@tanstack/react-query";
import { fetchAvailableProgram } from "../api/programApi";

export function useAvailableProgram(search = "") {
  return useQuery({
    queryKey: ["available-programs", search],
    queryFn: () => fetchAvailableProgram(search),
    staleTime: 0,
  });
}