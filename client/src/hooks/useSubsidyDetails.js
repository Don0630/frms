import { useQuery } from "@tanstack/react-query";
import { fetchSubsidyById } from "../api/subsidyApi";

export function useSubsidyDetails(id) {
  return useQuery({
    queryKey: ["subsidy", id],
    queryFn: () => fetchSubsidyById(id),
    enabled: !!id,
  });
}