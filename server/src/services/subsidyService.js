// services/subsidyService.js
import * as subsidyModel from "../models/subsidyModel.js";

export async function fetchSubsidies() {
  return await subsidyModel.getAllSubsidy();
}

export async function addSubsidy(subsidy) {
  return await subsidyModel.createSubsidy(subsidy);
}