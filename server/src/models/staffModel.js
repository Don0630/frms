// server/src/models/staffModel.js
import { db } from "../config/db.js";


// --------- GET ALL STAFF ---------
export async function getAllStaff() {
  const [rows] = await db.query("SELECT * FROM tblAgriculturalStaff ORDER BY StaffID");
  return rows || null;
}
