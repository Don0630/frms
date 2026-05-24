import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllCrop, addCrop, updateCrop, deleteCrop } from "../api/cropApi";
import { showErrorToast } from "../utils/toastUtility";

export default function useCrop() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["crops"] });
  const onError = (err) => {
  const status = err?.response?.status;
  if (status === 400 || status === 409) return;
  showErrorToast(err?.response?.data?.message || "Something went wrong.");
};

const onDeleteError = (err) => {
  showErrorToast(err?.response?.data?.message || "Something went wrong.");
};

  // ================= FETCH ALL CROPS =================
  const cropsQuery = useQuery({
    queryKey: ["crops"],
    queryFn: fetchAllCrop,
    staleTime: 1000 * 60 * 5,
  });

  // ================= CREATE CROP =================
  const createCropMutation = useMutation({
    mutationFn: addCrop,
    onSuccess: invalidate,
    onError,
  });

  // ================= UPDATE CROP =================
  const updateCropMutation = useMutation({
    mutationFn: ({ id, data }) => updateCrop({ CropID: id, ...data }),
    onSuccess: invalidate,
    onError,
  });

  // ================= DELETE CROP =================
  const deleteCropMutation = useMutation({
    mutationFn: (id) => deleteCrop(id),
    onSuccess: invalidate,
    onError: onDeleteError,
  });

  return {
    cropsQuery,
    createCropMutation,
    updateCropMutation,
    deleteCropMutation,
  };
}