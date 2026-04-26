import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllFarmer,
  addFarmer,
  updateFarmer,
  fetchSearchFarmers,
} from "../api/farmerApi";

export default function useFarmer(search = "") {
  const queryClient = useQueryClient();

  // ================= FETCH ALL FARMERS =================
  const farmersQuery = useQuery({
    queryKey: ["farmers"],
    queryFn: fetchAllFarmer,
  });

  // ================= SEARCH FARMERS =================
  const searchFarmersQuery = useQuery({
    queryKey: ["search-farmers", search],
    queryFn: () => fetchSearchFarmers(search),
    enabled: !!search,
  });

  // ================= CREATE FARMER =================
  const createFarmerMutation = useMutation({
    mutationFn: addFarmer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
      queryClient.invalidateQueries({ queryKey: ["search-farmers"] });
    },
  });

  // ================= UPDATE FARMER =================
  const updateFarmerMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateFarmer({ FarmerID: id, ...data }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
      queryClient.invalidateQueries({ queryKey: ["search-farmers"] });
    },
  });

  return {
    farmersQuery,
    searchFarmersQuery,
    createFarmerMutation,
    updateFarmerMutation,
  };
}