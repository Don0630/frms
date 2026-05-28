// services/programService.js
import * as programModel from "../models/programModel.js"; 
import { throwError } from "../utils/throwError.js";

export async function fetchPrograms() {
  return await programModel.getAllProgram();
}


// --------- ADD PROGRAM ---------
export async function addProgram(program) {
  return await programModel.createProgram({...program, Status: "Active"});
}


// --------- EDIT PROGRAM ---------
export async function editProgram(id, program) {
  const programId = parseInt(id);

  // Exists check
  const existing = await programModel.getProgramById(programId);
  if (!existing) throwError("Program not found", "NOT_FOUND", 404);

  // Fetch once — reuse below
  const totalDistributed = await programModel.getTotalDistributed(programId);
  const pendingCount = await programModel.getActiveDistributions(programId);
  const currentStatus = existing.Status;

  // Budget validation
  if (parseFloat(program.Budget) < totalDistributed) {
    throwError(
      `Budget cannot be less than the total already distributed (₱${totalDistributed.toLocaleString()})`,
      "INVALID_BUDGET", 400
    );
  }

  // Status transition rules
  if (currentStatus === "Dropped" && program.Status === "Completed") {
    throwError(`Cannot set to "Completed" — program was dropped`, "INVALID_STATUS_CHANGE", 400);
  }

  if (currentStatus === "Completed" && program.Status === "Dropped") {
    throwError(`Cannot set to "Dropped" — program is already completed`, "INVALID_STATUS_CHANGE", 400);
  }

  if (program.Status === "Dropped") {
    if (totalDistributed > 0) {
      throwError(`Cannot set to "Dropped" — budget has already been distributed`, "INVALID_STATUS_CHANGE", 400);
    }
    if (pendingCount > 0) {
      throwError(`Cannot set to "Dropped" — there are ${pendingCount} pending distributions`, "INVALID_STATUS_CHANGE", 400);
    }
  }

  if (program.Status === "Completed") {
    if (pendingCount > 0) {
      throwError(`Cannot set to "Completed" — there are ${pendingCount} pending distributions`, "INVALID_STATUS_CHANGE", 400);
    }
    if (parseFloat(totalDistributed) < parseFloat(program.Budget)) {
      throwError(`Cannot set to "Completed" — budget is not yet fully distributed`, "INVALID_STATUS_CHANGE", 400);
    }
  }
  
  return await programModel.updateProgram(programId, program);
}


// --------- REMOVE PROGRAM ---------
export async function removeProgram(id) {
  const programId = parseInt(id);

  const existing = await programModel.getProgramById(programId);
  if (!existing) throwError("Program not found", "NOT_FOUND", 404);

  return await programModel.deleteProgram(programId);
}


// Fetch available programs (Active Programs), optional search
export async function fetchAvailablePrograms(search = "") {
  return await programModel.getAvailablePrograms(search);
}