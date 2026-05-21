import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllStaff, addStaff, updateStaff } from "../api/staffApi";

export default function useStaff() { 
  const queryClient = useQueryClient();

  const staffsQuery = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchAllStaff,
    staleTime: 1000 * 60 * 5,
  });

  const createStaffMutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
    },
  });

  return {
    staffsQuery,
    createStaffMutation,
    updateStaffMutation,
  };
}