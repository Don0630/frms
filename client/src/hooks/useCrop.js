// src/hooks/useCrop.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllCrop,
  addCrop,
  updateCrop,
  fetchSearchCrops,
} from "../api/cropApi";

export default function useCrop(search = "") {
  const queryClient = useQueryClient();

  // ================= FETCH ALL CROPS =================
  const cropsQuery = useQuery({
    queryKey: ["crops"],
    queryFn: fetchAllCrop,
  });

  // ================= SEARCH CROPS =================
  const searchCropsQuery = useQuery({
    queryKey: ["search-crops", search],
    queryFn: () => fetchSearchCrops(search),
    enabled: !!search,
  });

  // ================= CREATE CROP =================
  const createCropMutation = useMutation({
    mutationFn: addCrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      queryClient.invalidateQueries({ queryKey: ["search-crops"] });
    },
  });

  // ================= UPDATE CROP =================
 const updateCropMutation = useMutation({
  mutationFn: ({ id, data }) => updateCrop({ CropID: id, ...data }),

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["crops"] });
    queryClient.invalidateQueries({ queryKey: ["search-crops"] });
  },
});

  return {
    cropsQuery,
    searchCropsQuery,
    createCropMutation,
    updateCropMutation,
  };
}