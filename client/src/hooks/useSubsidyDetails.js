import { useQuery } from "@tanstack/react-query";
import { fetchSubsidyDetails } from "../api/subsidyApi";

export function useSubsidyDetails(id) {
  return useQuery({
    queryKey: ["subsidy", id],
    queryFn: () => fetchSubsidyDetails(id),
    enabled: !!id,
  });
}