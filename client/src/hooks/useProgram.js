// src/hooks/useProgram.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllProgram,
  addProgram,
  updateProgram,
} from "../api/programApi";

export default function useProgram() {
  const queryClient = useQueryClient();

  const programsQuery = useQuery({
    queryKey: ["programs"],
    queryFn: fetchAllProgram,
    staleTime: 1000 * 60 * 5,
  });

  const createProgramMutation = useMutation({
    mutationFn: addProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] }); 
    },
  });

  const updateProgramMutation = useMutation({
    mutationFn: ({ id, data }) => updateProgram({ ProgramID: id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] }); 
    },
  });

  return {
    programsQuery,
    createProgramMutation,
    updateProgramMutation,
  };
}