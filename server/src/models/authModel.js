// server/src/models/authModel.js
import { db } from "../config/db.js";

// --------- FETCH USER DATA (for /auth/user) ---------
export async function fetchUser(id) {
  const [rows] = await db.query(
    `SELECT 
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
     WHERE u.UserID = ?`,
    [id]
  );
  return rows[0] || null;
}



// --------- GET USER NY ID (for login) ---------
export async function getUserById(identifier) {
  const [rows] = await db.query(
    `SELECT 
      u.UserID,
      u.Username,
      u.Role,
      u.PasswordHash,
      u.DateRegistered,
      u.LastLogin,
      u.Status,
      s.StaffID,
      s.FirstName,
      s.MiddleName,
      s.LastName,
      s.Department,
      s.ContactNumber,
      s.Email
     FROM tblUsers u
     JOIN tblAgriculturalStaff s ON u.StaffID = s.StaffID
     WHERE u.Username = ? OR s.Email = ?
     LIMIT 1`,
    [identifier, identifier]
  );
  return rows?.[0] || null;
}

