// server/src/models/staffModel.js
import { db } from "../config/db.js";

 
// --------- GET ALL STAFF ---------
export async function getAllStaff() {
  const query = `
    SELECT 
      s.StaffID,
      s.FirstName,
      s.LastName,
      s.MiddleName,
      s.Gender,
      s.ContactNumber,
      s.Email, 
      DATE_FORMAT(s.DateOfBirth, '%Y-%m-%d') AS DateOfBirth,
      s.Position,
      s.Department,

      CASE 
        WHEN u.StaffID IS NOT NULL THEN 1
        ELSE 0
      END AS IsUser

    FROM tblAgriculturalStaff s

    LEFT JOIN tblUsers u
      ON s.StaffID = u.StaffID

    WHERE u.Role != 'SuperAdmin' OR u.StaffID IS NULL

    ORDER BY s.StaffID
  `;

  const [rows] = await db.query(query);

  return rows || [];
}

 // --------- CREATE STAFF ---------
export async function insertStaff(staff) {
  const {
    FirstName,
    MiddleName,
    LastName,
    Gender,
    DateOfBirth,
    Position,
    Department,
    ContactNumber,
    Email,
  } = staff;

  const query = `
    INSERT INTO tblAgriculturalStaff 
    (FirstName, MiddleName, LastName, Gender, DateOfBirth, Position, Department, ContactNumber, Email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    FirstName,
    MiddleName,
    LastName,
    Gender,
    DateOfBirth,
    Position,
    Department,
    ContactNumber,
    Email,
  ];

  const [result] = await db.query(query, values);

  return {
    StaffID: result.insertId,
    ...staff,
  };
}

// --------- UPDATE STAFF ---------
export async function updateStaff(id, staff) {
  const {
    FirstName,
    MiddleName,
    LastName,
    Gender,
    DateOfBirth,
    Position,
    Department,
    ContactNumber,
    Email,
  } = staff;

  const query = `
    UPDATE tblAgriculturalStaff
    SET FirstName=?, MiddleName=?, LastName=?, Gender=?, DateOfBirth=?, Position=?, Department=?, ContactNumber=?, Email=?
    WHERE StaffID=?
  `;

  const values = [
    FirstName,
    MiddleName,
    LastName,
    Gender,
    DateOfBirth,
    Position,
    Department,
    ContactNumber,
    Email,
    id,
  ];

  const [result] = await db.query(query, values);

  return {
    StaffID: id,
    ...staff,
  };
}

// --------- DELETE STAFF ---------
export async function deleteStaff(id) {
  const [result] = await db.query(
    `DELETE FROM tblAgriculturalStaff WHERE StaffID = ?`,
    [id]
  );
  return result;
}

// --------- GET STAFF BY ID ---------
export async function getStaffById(id) {
  const [rows] = await db.query(
    `SELECT StaffID FROM tblAgriculturalStaff WHERE StaffID = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

// --------------- SEARCH AVAILABLE STAFF (NOT YET USERS) ---------------
export async function getAvailableStaff(search = "") {
  const searchPattern = `%${search}%`;
  const [rows] = await db.query(
    `
    SELECT 
      s.StaffID,
      s.FirstName,
      s.MiddleName,
      s.LastName
    FROM tblAgriculturalStaff s
    LEFT JOIN tblUsers u ON s.StaffID = u.StaffID
    WHERE u.StaffID IS NULL
      AND (
        CONCAT(s.FirstName, ' ', COALESCE(s.MiddleName, ''), ' ', s.LastName) LIKE ?
        OR
        CONCAT(s.LastName, ', ', s.FirstName, ' ', COALESCE(s.MiddleName, '')) LIKE ?
        OR
        CONCAT(s.LastName, ' ', s.FirstName) LIKE ?
      )
    ORDER BY s.FirstName, s.LastName
    LIMIT 10
    `,
    [searchPattern, searchPattern, searchPattern]
  );
  return rows || [];
}
