// services/subsidyDetailsService.js
import * as subsidyDetailsModel from "../models/subsidyDetailsModel.js";


export async function fetchSubsidyDetails() { 
  return await subsidyDetailsModel.getAllSubsidyDetails();
}
