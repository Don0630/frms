// src/hooks/useProgram.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllProgram,
  addProgram,
  updateProgram,
  fetchAvailableProgram,
} from "../api/programApi";

export default function useProgram(search = "") {
  const queryClient = useQueryClient();

  // ================= FETCH ALL PROGRAMS =================
  const programsQuery = useQuery({
    queryKey: ["programs"],
    queryFn: fetchAllProgram,
  });

  

  // ================= CREATE PROGRAM =================
  const createProgramMutation = useMutation({
    mutationFn: addProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["available-programs"],
      });
    },
  });

  // ================= UPDATE PROGRAM =================
  const updateProgramMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateProgram({
        ProgramID: id,
        ...data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["available-programs"],
      });
    },
  });


// ================= FETCH AVAILABLE PROGRAMS =================
  const availableProgramsQuery = useQuery({
    queryKey: ["available-programs", search],
    queryFn: () => fetchAvailableProgram(search),
    staleTime: 0,
  });




  

  return {
    programsQuery,
    availableProgramsQuery,
    createProgramMutation,
    updateProgramMutation,
  };
}