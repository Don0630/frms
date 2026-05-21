import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllSubsidy,
  addSubsidy,
  updateSubsidy,
} from "../api/subsidyApi";

export default function useSubsidy() {
  const queryClient = useQueryClient();

  // ================= FETCH ALL SUBSIDY =================
  const subsidyQuery = useQuery({
    queryKey: ["subsidies"],
    queryFn: fetchAllSubsidy,
    staleTime: 1000 * 60 * 5,
  });

  // ================= ADD SUBSIDY =================
  const createSubsidyMutation = useMutation({
    mutationFn: addSubsidy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subsidies"] });
    },
  });

  // ================= UPDATE SUBSIDY =================
  const updateSubsidyMutation = useMutation({
    mutationFn: ({ id, data }) => updateSubsidy({ DistributionID: id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subsidies"] });
    },
  });

  return {
    subsidyQuery,
    createSubsidyMutation,
    updateSubsidyMutation,
  };
}