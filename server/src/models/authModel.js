// server/src/models/authModel.js
import { db } from "../config/db.js";


// --------- FIND BY USERNAME OR EMAIL ---------
export async function findByUsernameOrEmail(identifier) {
  const [rows] = await db.query( `SELECT * FROM tblUsers WHERE Username = ? OR Email = ? LIMIT 1`, [identifier, identifier]);
  return rows[0] || null;
}