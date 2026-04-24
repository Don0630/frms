// server/src/models/userModel.js
import { db } from "../config/db.js";


// FETCH ALL USER
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



// INSERT USER
export async function insertUser({ staffId, username, hashedPassword, role }) { 
    const query = `
    INSERT INTO tblUsers (StaffID, Username, PasswordHash, Role)
     VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [staffId, username, hashedPassword, role]);

    return { id: result.insertId };
}



// UPDATE USER
export async function updateUser({ userId, username, role }) {
  const query = `
    UPDATE tblUsers
    SET Username = ?, Role = ?
    WHERE UserID = ?
  `;

  const [result] = await db.query(query, [username, role, userId,]);

  return { affectedRows: result.affectedRows, userId, };
}


export async function deleteUser(userId) {
  const query = `
    DELETE FROM tblUsers
    WHERE UserID = ?
  `;

  const [result] = await db.query(query, [userId]);
  return result;
}