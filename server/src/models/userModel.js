// server/src/models/userModel.js
import { db } from "../config/db.js";

// --------- GET ALL USERS ---------
export async function getAllUsers() {
  const [rows] = await db.query(`
    SELECT 
      u.UserID,
      u.StaffID,
      u.Username,
      u.Role,
      s.FirstName,
      s.LastName,
      s.MiddleName,
      s.Department,
      s.ContactNumber,
      s.Email
    FROM tblUsers u
    JOIN tblAgriculturalStaff s ON u.StaffID = s.StaffID
    WHERE u.Role != 'SuperAdmin'
    ORDER BY s.FirstName, s.LastName
  `);
  return rows || [];
}

// --------- CREATE USER ---------
export async function createUser(user) {
  const { staffId, username, hashedPassword, role } = user;

  const query = `
    INSERT INTO tblUsers (StaffId, Username, PasswordHash, Role)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [staffId, username, hashedPassword, role]);

  return {
    UserID: result.insertId,
    ...user,
  };
}


// --------- UPDATE USER ---------
export async function updateUser(id, user) {
  const { username, role } = user;

  const query = `
    UPDATE tblUsers
    SET Username = ?, Role = ?
    WHERE UserID = ?
  `;

  await db.query(query, [username, role, id]);

  return {
    UserID: id,
    ...user,
  };
}

// --------- DELETE USER ---------
export async function deleteUser(id) {
  const [result] = await db.query(
    `DELETE FROM tblUsers WHERE UserID = ?`,
    [id]
  );
  return result;
}

// --------- GET USER BY ID ---------
export async function getUserById(id) {
  const [rows] = await db.query(
    `SELECT UserID FROM tblUsers WHERE UserID = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

// --------- FIND USER BY STAFF ID ---------
export async function findUserByStaffId(staffId) {
  const [rows] = await db.query(
    `SELECT UserID FROM tblUsers WHERE StaffID = ? LIMIT 1`,
    [staffId]
  );
  return rows[0] || null;
}