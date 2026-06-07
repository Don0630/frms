// src/hooks/useAuth.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../api/authApi";

export default function useAuth() {
  const queryClient = useQueryClient();

  // ================= LOGIN =================
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      queryClient.setQueryData(["user"], res);
    },
  });

  // ================= LOGOUT =================
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  return { loginMutation, logoutMutation };
}