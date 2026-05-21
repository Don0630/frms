// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../api/authApi";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      queryClient.setQueryData(["authUser"], res.data.user);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: authApi.me,
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
  });
}

