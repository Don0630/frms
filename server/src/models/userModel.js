// server/src/models/userModel.js
import { db } from "../config/db.js";


// Fetch all users with staff info
export async function getAllUsers() {
  const [rows] = await db.query(`
    SELECT 
      u.UserID,
      u.StaffID,
      u.Username,
      u.Role,
      s.FirstName,
      s.LastName,
      s.Department,
      s.ContactNumber,
      s.Email
    FROM tblUsers u
    JOIN tblAgriculturalStaff s ON u.StaffID = s.StaffID
    ORDER BY s.FirstName, s.LastName
  `);

  return rows;
}


export async function insertUser({ staffId, username, hashedPassword, role }) { 
    const query = `
    INSERT INTO tblUsers (StaffID, Username, PasswordHash, Role)
     VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [staffId, username, hashedPassword, role]);

    return { id: result.insertId };
}

 