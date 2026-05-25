import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import { fetchAllSubsidy, addSubsidy, updateSubsidy, deleteSubsidy } from "../api/subsidyApi";

export default function useSubsidy() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["subsidies"] });
  const onError = (err) => {
    const status = err?.response?.status;
    if (status === 400 || status === 409) return;
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };
  const onDeleteError = (err) => {
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };

  // ================= FETCH ALL SUBSIDY =================
  const subsidyQuery = useQuery({
    queryKey: ["subsidies"],
    queryFn: fetchAllSubsidy,
    staleTime: 1000 * 60 * 5,
  });

  // ================= ADD SUBSIDY =================
  const createSubsidyMutation = useMutation({
    mutationFn: addSubsidy,
    onSuccess: invalidate,
    onError,
  });

  // ================= UPDATE SUBSIDY =================
  const updateSubsidyMutation = useMutation({
    mutationFn: ({ id, data }) => updateSubsidy({ DistributionID: id, ...data }),
    onSuccess: invalidate,
    onError,
  });

  // ================= DELETE SUBSIDY =================
  const deleteSubsidyMutation = useMutation({
    mutationFn: deleteSubsidy,
    onSuccess: invalidate,
    onError: onDeleteError,
  });

  return {
    subsidyQuery,
    createSubsidyMutation,
    updateSubsidyMutation,
    deleteSubsidyMutation,
  };
}