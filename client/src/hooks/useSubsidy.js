import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllSubsidy,
  addSubsidy,
} from "../api/subsidyApi";

export default function useSubsidy() {
  const queryClient = useQueryClient();

  // ================= FETCH ALL SUBSIDY =================
  const subsidyQuery = useQuery({
    queryKey: ["subsidies"],
    queryFn: fetchAllSubsidy,
  });

  // ================= ADD SUBSIDY =================
  const createSubsidyMutation = useMutation({
    mutationFn: addSubsidy,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subsidies"],
      });
    },
  });

  return {
    subsidyQuery,
    createSubsidyMutation,
  };
}