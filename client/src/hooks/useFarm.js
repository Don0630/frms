import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addFarm,
  updateFarm,
  deleteFarm,
} from "../api/farmerApi";

export function useFarm(farmerId) {
  const queryClient = useQueryClient();

  // CREATE FARM
  const createFarmMutation = useMutation({
    mutationFn: addFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["farmer", farmerId],
      });
    },
  });

  // UPDATE FARM
  const updateFarmMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateFarm({ FarmID: id, ...data }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["farmer", farmerId],
      });
    },
  });

  // DELETE FARM
  const deleteFarmMutation = useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["farmer", farmerId],
      });
    },
  });

  return {
    createFarmMutation,
    updateFarmMutation,
    deleteFarmMutation,
  };
}