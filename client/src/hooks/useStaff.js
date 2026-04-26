// src/hooks/useStaff.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllStaff,
  addStaff,
  updateStaff,
  fetchAvailableStaff,
} from "../api/staffApi";

export default function useStaff(search = "") {
  const queryClient = useQueryClient();

  // ================= FETCH ALL STAFF =================
  const staffsQuery = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchAllStaff,
  });

  // ================= CREATE STAFF =================
  const createStaffMutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      queryClient.invalidateQueries({ queryKey: ["available-staff"] });
    },
  });

  // ================= UPDATE STAFF =================
  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      queryClient.invalidateQueries({ queryKey: ["available-staff"] });
    },
  });

  // ================= FETCH AVAILABLE STAFF =================
  const availableStaffQuery = useQuery({
    queryKey: ["available-staff", search],
    queryFn: () => fetchAvailableStaff(search),
    staleTime: 0,
  });

  return {
    staffsQuery,
    createStaffMutation,
    updateStaffMutation,
    availableStaffQuery,
  };
}