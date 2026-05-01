// src/hooks/useMonitoring.js
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { fetchAllMonitoring, addMonitoring, updateMonitoring } from "../api/monitoringApi";

export default function useMonitoring() {
  const queryClient = useQueryClient();

  // ================= FETCH ALL MONITORING =================
  const monitoringQuery = useQuery({
    queryKey: ["monitoring"],
    queryFn: fetchAllMonitoring,
  });

  // ================= CREATE MONITORING =================
  const createMonitoringMutation = useMutation({
    mutationFn: addMonitoring,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["monitoring"],
      });
    },
  });


  // ================= UPDATE Monitoring =================
  const updateMonitoringMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateMonitoring({ ReportID: id, ...data }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitoring"] }); 
    },
  });



  return {
    monitoringQuery,
    createMonitoringMutation,
    updateMonitoringMutation
  };
}