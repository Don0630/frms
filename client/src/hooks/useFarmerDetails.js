import { useQuery } from "@tanstack/react-query";
import { fetchFarmerById } from "../api/farmerApi";

export function useFarmerDetails(id) {
  return useQuery({
    queryKey: ["farmer", id],
    queryFn: () => fetchFarmerById(id),
    enabled: !!id,
  });
}