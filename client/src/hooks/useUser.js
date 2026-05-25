import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import * as userApi from "../api/userApi";

export default function useUsers() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["users"] });
  const onError = (err) => {
  const status = err?.response?.status;
    if (status === 400 || status === 409) return;
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };
  const onDeleteError = (err) => {
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };

  // ================= FETCH =================
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: userApi.fetchAllUser,
    staleTime: 1000 * 60 * 5,
  });

  // ================= CREATE =================
  const createUserMutation = useMutation({
    mutationFn: userApi.registerUser,
    onSuccess: invalidate,
    onError,
  });

  // ================= UPDATE =================
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: invalidate,
    onError,
  });

  // ================= DELETE =================
  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: invalidate,
    onError: onDeleteError,
  });

  return {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
}