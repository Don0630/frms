// services/farmerService.js
import * as farmerModel from "../models/farmerModel.js";


export async function fetchFarmers() {
  return await farmerModel.getAllFarmer();
}
 