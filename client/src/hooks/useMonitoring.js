import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import { fetchAllMonitoring, addMonitoring, updateMonitoring, deleteMonitoring } from "../api/monitoringApi";

export default function useMonitoring() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["monitoring"] });
  const onError = (err) => {
    const status = err?.response?.status;
    if (status === 400 || status === 409) return;
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };
  const onDeleteError = (err) => {
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };

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

  // ================= DELETE MONITORING =================
  const deleteMonitoringMutation = useMutation({
    mutationFn: deleteMonitoring,
    onSuccess: invalidate,
    onError: onDeleteError,
  });

  return {
    monitoringQuery,
    createMonitoringMutation,
    updateMonitoringMutation,
    deleteMonitoringMutation,
  };
}