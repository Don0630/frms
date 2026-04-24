import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllUser,
  updateUser,
  deleteUser,
  registerUser,
} from "../api/userApi";

export default function useUsers() {
  const queryClient = useQueryClient();

  // ================= FETCH =================
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUser,
  });

  // ================= CREATE =================
  const createUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // ================= UPDATE =================
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // ================= DELETE =================
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
}