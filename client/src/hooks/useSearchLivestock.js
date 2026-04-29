import { useQuery } from "@tanstack/react-query";
import { fetchSearchLivestock } from "../api/livestockApi";


  // ================= SEARCH =================
export default function useSearchLivestock(search = "") {
  const searchLivestockQuery = useQuery({
    queryKey: ["search-livestock", search],
    queryFn: () => fetchSearchLivestock(search),
    staleTime: 0,
  });

  return {
    searchLivestockQuery,
  };
}



