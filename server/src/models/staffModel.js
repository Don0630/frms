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


export async function getAvailableStaff(search = "") {
  const searchPattern = `%${search}%`;
  const [rows] = await db.query(
    `
    SELECT 
      s.StaffID,
      s.FirstName,
      s.LastName
    FROM tblAgriculturalStaff s
    LEFT JOIN tblUsers u ON s.StaffID = u.StaffID
    WHERE u.StaffID IS NULL
      AND (s.FirstName LIKE ? OR s.LastName LIKE ?)
    ORDER BY s.FirstName, s.LastName
    LIMIT 3
    `,
    [searchPattern, searchPattern]
  );

  return rows;
}


// --------- FIND DUPLICATE STAFF NAME ---------
export async function findDuplicateStaff(FirstName, MiddleName, LastName, excludeId = null) {
  const [rows] = await db.query(
    `
    SELECT StaffID 
    FROM tblAgriculturalStaff
    WHERE FirstName = ?
      AND MiddleName = ?
      AND LastName = ?
      AND (? IS NULL OR StaffID != ?)
    LIMIT 1
    `,
    [FirstName, MiddleName, LastName, excludeId, excludeId]
  );
  return rows[0] || null;
}

// --------- FIND DUPLICATE STAFF CONTACT ---------
export async function findDuplicateStaffContact(ContactNumber, excludeId = null) {
  const [rows] = await db.query(
    `
    SELECT StaffID 
    FROM tblAgriculturalStaff
    WHERE ContactNumber = ?
      AND (? IS NULL OR StaffID != ?)
    LIMIT 1
    `,
    [ContactNumber, excludeId, excludeId]
  );
  return rows[0] || null;
}

// --------- FIND DUPLICATE STAFF EMAIL ---------
export async function findDuplicateStaffEmail(Email, excludeId = null) {
  const [rows] = await db.query(
    `
    SELECT StaffID 
    FROM tblAgriculturalStaff
    WHERE Email = ?
      AND (? IS NULL OR StaffID != ?)
    LIMIT 1
    `,
    [Email, excludeId, excludeId]
  );
  return rows[0] || null;
}