import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import * as staffApi from "../api/staffApi";

export default function useStaff() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["staffs"] });
  const onError = (err) => {
  const status = err?.response?.status;
    if (status === 400 || status === 409) return;
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };
  const onDeleteError = (err) => {
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };


  const staffsQuery = useQuery({
    queryKey: ["staffs"],
    queryFn: staffApi.fetchAllStaff,
    staleTime: 1000 * 60 * 5,
  });

  const createStaffMutation = useMutation({
    mutationFn: staffApi.addStaff,
    onSuccess: invalidate,
    onError,
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => staffApi.updateStaff(id, data),
    onSuccess: invalidate,
    onError,
  });

  // ================= DELETE STAFF =================
  const deleteStaffMutation = useMutation({
    mutationFn: staffApi.deleteStaff,
    onSuccess: invalidate,
    onError: onDeleteError,
  });

  return {
    staffsQuery,
    createStaffMutation,
    updateStaffMutation,
    deleteStaffMutation,
  };
}