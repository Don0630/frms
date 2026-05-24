import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import {
  addDistribution,
  updateDistribution,
  deleteDistribution,
} from "../api/subsidyApi";

export function useDistribution(subsidyId) {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["subsidy", subsidyId] });
  const onError = (err) => showErrorToast(err?.response?.data?.message || "Something went wrong.");

  // ================= CREATE DISTRIBUTION =================
  const createDistributionMutation = useMutation({
    mutationFn: addDistribution,
    onSuccess: invalidate,
    onError,
  });

  // ================= UPDATE DISTRIBUTION =================
  const updateDistributionMutation = useMutation({
    mutationFn: ({ id, data }) => updateDistribution({ DistributionDetailsID: id, ...data }),
    onSuccess: invalidate,
    onError,
  });

  // ================= DELETE DISTRIBUTION =================
  const deleteDistributionMutation = useMutation({
    mutationFn: deleteDistribution,
    onSuccess: invalidate,
    onError,
  });

  return {
    createDistributionMutation,
    updateDistributionMutation,
    deleteDistributionMutation,
  };
}