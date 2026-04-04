// server/src/models/farmerModel.js
import { db } from "../config/db.js";


// --------- GET ALL STAFF ---------
export async function getAllFarmer() {
  const [rows] = await db.query("SELECT * FROM tblFarmers ORDER BY FarmerID");
  return rows || null;
}


