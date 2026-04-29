import { useQuery } from "@tanstack/react-query";
import { fetchSearchFarmer } from "../api/farmerApi";

 // ================= SEARCH FARMERS =================
export default function useSearchFarmer(search = "") {
  const searchFarmerQuery = useQuery({
    queryKey: ["search-farmer", search],
    queryFn: () => fetchSearchFarmer(search),
    staleTime: 0,
  });


  return {
    searchFarmerQuery,
  };
}
