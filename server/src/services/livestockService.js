// services/livestockService.js
import * as livestockModel from "../models/livestockModel.js";


export async function fetchLivestocks() {
  return await livestockModel.getAllLivestock();
}
