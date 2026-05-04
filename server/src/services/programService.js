// services/programService.js
import * as programModel from "../models/programModel.js"; 


export async function fetchPrograms() {
  return await programModel.getAllProgram();
}


export async function addProgram(program) {
 
  // Validate Existing Prgoram
const existingProgram = await programModel.findProgramByName(program.ProgramName);
  if (existingProgram) {
    const error = new Error("Program already exists");
    error.statusCode = 409;
    throw error;
  }
  
  return await programModel.createProgram(program);
}


export async function editProgram(id, program) {
  return await programModel.updateProgram(id, program);
}


// Fetch available programs (Active Programs), optional search
export async function fetchAvailablePrograms(search = "") {
  return await programModel.getAvailablePrograms(search);
}