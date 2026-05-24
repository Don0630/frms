import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import { fetchAllUser, updateUser, deleteUser, registerUser } from "../api/userApi";

export default function useUsers() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["users"] });
  const onError = (err) => showErrorToast(err?.response?.data?.message || "Something went wrong.");

  // ================= FETCH =================
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUser,
    staleTime: 1000 * 60 * 5,
  });

  // ================= CREATE =================
  const createUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: invalidate,
    onError,
  });

  // ================= UPDATE =================
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: invalidate,
    onError,
  });

  // ================= DELETE =================
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: invalidate,
    onError,
  });

  return {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
}