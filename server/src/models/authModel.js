// server/src/models/authModel.js
import { db } from "../config/db.js";

// --------- FIND BY USERNAME OR EMAIL ---------
export async function findByUsernameOrEmail(identifier) {
  const [rows] = await db.query(
    `SELECT 
      UserID,
      Username,
      Email,
      Role,
      StaffID,
      DateRegistered,
      LastLogin,
      Status,
      PasswordHash
     FROM tblUsers
     WHERE Username = ? OR Email = ?
     LIMIT 1`,
    [identifier, identifier]
  );

  return rows?.[0] || null;
}


export async function getUserById(id) {
  const [rows] = await db.query(
    `
    SELECT 
      u.UserID,
      u.Username,
      u.Role,
      s.StaffID,
      s.FirstName,
      s.MiddleName,
      s.LastName,
      s.Department,
      s.ContactNumber,
      s.Email
    FROM tblUsers u
    JOIN tblAgriculturalStaff s ON u.StaffID = s.StaffID
    WHERE u.UserID = ?
    `,
    [id]
  );
  return rows[0] || null;
}