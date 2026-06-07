// src/hooks/useProfile.js
import { useQuery } from "@tanstack/react-query";
import * as authApi from "../api/authApi";

export default function useProfile() {
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: authApi.user,
    retry: false,
    staleTime: Infinity,
  });

  return { userQuery };
}