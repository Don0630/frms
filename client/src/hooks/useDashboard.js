// src/hooks/useDashboard.js
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "../api/dashboardApi";

export default function useDashboard() {
 
 
// ================= FETCH DASHBOARD DATA =================
    const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5,
  });

  return { dashboardQuery };
}