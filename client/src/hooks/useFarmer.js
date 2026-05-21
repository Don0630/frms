import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllFarmer,
  addFarmer,
  updateFarmer, 
} from "../api/farmerApi";

export default function useFarmer(search = "") {
  const queryClient = useQueryClient();

  // ================= FETCH ALL FARMERS =================
  const farmersQuery = useQuery({
    queryKey: ["farmers"],
    queryFn: fetchAllFarmer,
    staleTime: 1000 * 60 * 5,
  });

 
  // ================= CREATE FARMER =================
  const createFarmerMutation = useMutation({
    mutationFn: addFarmer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] }); 
    },
  });

  // ================= UPDATE FARMER =================
  const updateFarmerMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateFarmer({ FarmerID: id, ...data }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] }); 
    },
  });

  return {
    farmersQuery, 
    createFarmerMutation,
    updateFarmerMutation,
  };
}