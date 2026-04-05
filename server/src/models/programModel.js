// server/src/models/programModel.js
import { db } from "../config/db.js";


// --------- GET ALL PROGRAM ---------
export async function getAllProgram() {
  const [rows] = await db.query("SELECT * FROM tblPrograms ORDER BY ProgramID");
  return rows || null;
}


 