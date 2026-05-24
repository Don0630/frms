import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import { fetchAllMonitoring, addMonitoring, updateMonitoring } from "../api/monitoringApi";

export default function useMonitoring() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["monitoring"] });
  const onError = (err) => showErrorToast(err?.response?.data?.message || "Something went wrong.");

  // ================= FETCH ALL MONITORING =================
  const monitoringQuery = useQuery({
    queryKey: ["monitoring"],
    queryFn: fetchAllMonitoring,
    staleTime: 1000 * 60 * 5,
  });

  // ================= CREATE MONITORING =================
  const createMonitoringMutation = useMutation({
    mutationFn: addMonitoring,
    onSuccess: invalidate,
    onError,
  });

  // ================= UPDATE MONITORING =================
  const updateMonitoringMutation = useMutation({
    mutationFn: ({ id, data }) => updateMonitoring({ ReportID: id, ...data }),
    onSuccess: invalidate,
    onError,
  });

  return {
    monitoringQuery,
    createMonitoringMutation,
    updateMonitoringMutation,
  };
}