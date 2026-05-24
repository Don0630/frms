import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import { fetchAllLivestock, addLivestock, updateLivestock, deleteLivestock } from "../api/livestockApi";

export default function useLivestock() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["livestock"] });
  const onError = (err) => {
    const status = err?.response?.status;
    if (status === 400 || status === 409) return;
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };
  const onDeleteError = (err) => {
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };

  const livestockQuery = useQuery({
    queryKey: ["livestock"],
    queryFn: fetchAllLivestock,
    staleTime: 1000 * 60 * 5,
  });

  const createLivestockMutation = useMutation({
    mutationFn: addLivestock,
    onSuccess: invalidate,
    onError,
  });

  const updateLivestockMutation = useMutation({
    mutationFn: ({ id, data }) => updateLivestock({ LivestockID: id, ...data }),
    onSuccess: invalidate,
    onError,
  });

  const deleteLivestockMutation = useMutation({
    mutationFn: deleteLivestock,
    onSuccess: invalidate,
    onError: onDeleteError,
  });

  return {
    livestockQuery,
    createLivestockMutation,
    updateLivestockMutation,
    deleteLivestockMutation,
  };
}