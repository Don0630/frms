import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import * as farmerApi from "../api/farmerApi";

export function useFarm(farmerId) {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["farmer", farmerId] });
  const onError = (err) => {
  const status = err?.response?.status;
    if (status === 400 || status === 409) return;
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };
  const onDeleteError = (err) => {
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };

  // CREATE FARM
  const createFarmMutation = useMutation({
    mutationFn: farmerApi.addFarm,
    onSuccess: invalidate,
    onError,
  });

  // UPDATE FARM
  const updateFarmMutation = useMutation({
    mutationFn: ({ id, data }) => farmerApi.updateFarm({ FarmID: id, ...data }),
    onSuccess: invalidate,
    onError,
  });

  // DELETE FARM
  const deleteFarmMutation = useMutation({
    mutationFn: farmerApi.deleteFarm,
    onSuccess: invalidate,
    onError: onDeleteError,
  });

  return {
    createFarmMutation,
    updateFarmMutation,
    deleteFarmMutation,
  };
}