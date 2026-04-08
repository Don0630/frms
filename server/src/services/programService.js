// services/programService.js
import * as programModel from "../models/programModel.js";


export async function fetchPrograms() {
  return await programModel.getAllProgram();
}


export async function addProgram(program) {
  return await programModel.createProgram(program);
}


