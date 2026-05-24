import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import { fetchAllStaff, addStaff, updateStaff } from "../api/staffApi";

export default function useStaff() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["staffs"] });
  const onError = (err) => showErrorToast(err?.response?.data?.message || "Something went wrong.");

  const staffsQuery = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchAllStaff,
    staleTime: 1000 * 60 * 5,
  });

  const createStaffMutation = useMutation({
    mutationFn: addStaff,
    onSuccess: invalidate,
    onError,
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => updateStaff(id, data),
    onSuccess: invalidate,
    onError,
  });

  return {
    staffsQuery,
    createStaffMutation,
    updateStaffMutation,
  };
}