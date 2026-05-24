import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../utils/toastUtility";
import * as programApi from "../api/programApi";

export default function useProgram() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["programs"] });
  const onError = (err) => {
  const status = err?.response?.status;
    if (status === 400 || status === 409) return;
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };
  const onDeleteError = (err) => {
    showErrorToast(err?.response?.data?.message || "Something went wrong.");
  };

  const programsQuery = useQuery({
    queryKey: ["programs"],
    queryFn: programApi.fetchAllProgram,
    staleTime: 1000 * 60 * 5,
  });

  const createProgramMutation = useMutation({
    mutationFn: programApi.addProgram,
    onSuccess: invalidate,
    onError,
  });

  const updateProgramMutation = useMutation({
    mutationFn: ({ id, data }) => programApi.updateProgram({ ProgramID: id, ...data }),
    onSuccess: invalidate,
    onError,
  });

  // ================= DELETE PROGRAM =================
  const deleteProgramMutation = useMutation({
    mutationFn: programApi.deleteProgram,
    onSuccess: invalidate,
    onError: onDeleteError,
  });

  return {
    programsQuery,
    createProgramMutation,
    updateProgramMutation,
    deleteProgramMutation
  };
}