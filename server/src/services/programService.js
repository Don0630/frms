// services/programService.js
import * as programModel from "../models/programModel.js";


export async function fetchPrograms() {
  return await programModel.getAllProgram();
}


export async function addProgram(program) {
  return await programModel.createProgram(program);
}


// Fetch available programs (Active Programs), optional search
export async function fetchAvailablePrograms(search = "") {
  return await programModel.getAvailablePrograms(search);
}