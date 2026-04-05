// server/src/models/livestockModel.js
import { db } from "../config/db.js";


// --------- GET ALL LIVESTOCK ---------
export async function getAllLivestock() {
  const [rows] = await db.query("SELECT * FROM tblLivestock ORDER BY LivestockID");
  return rows || null;
}


 