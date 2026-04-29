// src/hooks/useCrop.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllCrop,
  addCrop,
  updateCrop, 
} from "../api/cropApi";

export default function useCrop(search = "") {
  const queryClient = useQueryClient();

  // ================= FETCH ALL CROPS =================
  const cropsQuery = useQuery({
    queryKey: ["crops"],
    queryFn: fetchAllCrop,
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
    createCropMutation,
    updateCropMutation,
  };
}