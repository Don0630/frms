import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDistribution,
  updateDistribution,
  deleteDistribution,
} from "../api/subsidyApi";

export function useDistribution(subsidyId) {
  const queryClient = useQueryClient();

  // ================= CREATE DISTRIBUTION =================
  const createDistributionMutation = useMutation({
    mutationFn: addDistribution,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subsidy", subsidyId],
      });
    },
  });

  // ================= UPDATE DISTRIBUTION =================
  const updateDistributionMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateDistribution({
        DistributionDetailsID: id,
        ...data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subsidy", subsidyId],
      });
    },
  });

  // ================= DELETE DISTRIBUTION =================
  const deleteDistributionMutation = useMutation({
    mutationFn: deleteDistribution,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subsidy", subsidyId],
      });
    },
  });

  return {
    createDistributionMutation,
    updateDistributionMutation,
    deleteDistributionMutation,
  };
}