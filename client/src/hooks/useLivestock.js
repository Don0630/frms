import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllLivestock,
  addLivestock,
  updateLivestock,
  fetchSearchLivestock,
} from "../api/livestockApi";

export default function useLivestock(search = "") {
  const queryClient = useQueryClient();

  // ================= FETCH ALL =================
  const livestockQuery = useQuery({
    queryKey: ["livestock"],
    queryFn: fetchAllLivestock,
  });

  // ================= SEARCH =================
  const searchLivestockQuery = useQuery({
    queryKey: ["search-livestock", search],
    queryFn: () => fetchSearchLivestock(search),
    enabled: !!search,
  });

  // ================= CREATE =================
  const createLivestockMutation = useMutation({
    mutationFn: addLivestock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      queryClient.invalidateQueries({ queryKey: ["search-livestock"] });
    },
  });

  // ================= UPDATE (FIXED PATTERN) =================
  const updateLivestockMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateLivestock({
        LivestockID: id,
        ...data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      queryClient.invalidateQueries({ queryKey: ["search-livestock"] });
    },
  });

  return {
    livestockQuery,
    searchLivestockQuery,
    createLivestockMutation,
    updateLivestockMutation,
  };
}