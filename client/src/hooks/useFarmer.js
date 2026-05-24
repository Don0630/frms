import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import { fetchAllFarmer, addFarmer, updateFarmer, deleteFarmer } from "../api/farmerApi";

export default function useFarmer() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["farmers"] });
  const onError = (err) => {
    const status = err?.response?.status;
    if (status === 400 || status === 409) return;
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };
  const onDeleteError = (err) => {
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };

  // ================= FETCH ALL FARMERS =================
  const farmersQuery = useQuery({
    queryKey: ["farmers"],
    queryFn: fetchAllFarmer,
    staleTime: 1000 * 60 * 5,
  });

  // ================= CREATE FARMER =================
  const createFarmerMutation = useMutation({
    mutationFn: addFarmer,
    onSuccess: invalidate,
    onError,
  });

  // ================= UPDATE FARMER =================
  const updateFarmerMutation = useMutation({
    mutationFn: ({ id, data }) => updateFarmer({ FarmerID: id, ...data }),
    onSuccess: invalidate,
    onError,
  });

  // ================= DELETE FARMER =================
  const deleteFarmerMutation = useMutation({
    mutationFn: deleteFarmer,
    onSuccess: invalidate,
    onError: onDeleteError,
  });

  return {
    farmersQuery,
    createFarmerMutation,
    updateFarmerMutation,
    deleteFarmerMutation,
  };
}