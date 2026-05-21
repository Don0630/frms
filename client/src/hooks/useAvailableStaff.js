// src/hooks/useAvailableStaff.js
import { useQuery } from "@tanstack/react-query";
import { fetchAvailableStaff } from "../api/staffApi";

export function useAvailableStaff(search = "") {
  return useQuery({
    queryKey: ["available-staff", search],
    queryFn: () => fetchAvailableStaff(search),
    staleTime: 0,
  });
}