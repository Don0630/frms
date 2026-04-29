import { useQuery } from "@tanstack/react-query";
import { fetchAvailableFarmer } from "../api/subsidyApi";

export function useAvailableFarmer(distributionID, search) {
  return useQuery({
    queryKey: ["available-farmers", distributionID, search],
    queryFn: () => fetchAvailableFarmer(distributionID, search),
    enabled: !!distributionID,
  });
}