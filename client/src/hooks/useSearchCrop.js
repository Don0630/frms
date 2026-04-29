import { useQuery } from "@tanstack/react-query";
import { fetchSearchCrop } from "../api/cropApi";

export default function useSearchCrop(search = "") {
  const searchCropQuery = useQuery({
    queryKey: ["search-crop", search],
    queryFn: () => fetchSearchCrop(search),
    staleTime: 0,
  });

  return {
    searchCropQuery,
  };
}