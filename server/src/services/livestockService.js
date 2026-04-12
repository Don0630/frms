// services/livestockService.js
import * as livestockModel from "../models/livestockModel.js";


export async function fetchLivestocks() {
  return await livestockModel.getAllLivestock();
}


export async function addLivestock(livestock) {
  return await livestockModel.createLivestock(livestock);
}

export async function fetchSearchLivestock(search = "") {
  return await livestockModel.getSearchLivestock(search);
}
