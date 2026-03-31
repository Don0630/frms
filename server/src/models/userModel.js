// server/src/models/userModel.js
import { db } from "../config/db.js";

export async function insertUser({ staffId, username, hashedPassword, role }) { 
  const [result] = await db.query(
    `INSERT INTO tblUsers (StaffID, Username, PasswordHash, Role)
     VALUES (?, ?, ?, ?)`,
    [staffId, username, hashedPassword, role] // use hashedPassword, not plain password
  );
  return { id: result.insertId };
}

export async function markStaffAsUser(staffId) {
  await db.query(
    `UPDATE tblAgriculturalStaff SET IsUser = 1 WHERE StaffID = ?`,
    [staffId]
  );
}