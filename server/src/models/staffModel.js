// server/src/models/staffModel.js
import { db } from "../config/db.js";


// --------- GET ALL STAFF ---------
export async function getAllStaff() {
  const query = `
    SELECT 
      s.*,
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
    Position,
    Department,
    ContactNumber,
    Email,
  } = staff;

  const query = `
    INSERT INTO tblAgriculturalStaff 
    (FirstName, MiddleName, LastName, Gender, Position, Department, ContactNumber, Email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    FirstName,
    MiddleName,
    LastName,
    Gender,
    Position,
    Department,
    ContactNumber,
    Email,
  ];

  const [result] = await db.query(query, values);

  return {
    StaffID: result.insertId,
    FirstName,
    MiddleName,
    LastName,
    Gender,
    Position,
    Department,
    ContactNumber,
    Email,
  };
}


 
// --------- UPDATE STAFF ---------
export async function updateStaff(id, staff) {
  const {
    FirstName,
    MiddleName,
    LastName,
    Gender,
    Position,
    Department,
    ContactNumber,
  } = staff;

  const query = `
    UPDATE tblAgriculturalStaff
    SET FirstName=?, MiddleName=?, LastName=?, Gender=?, Position=?, Department=?, ContactNumber=?
    WHERE StaffID=?
  `;

  const values = [
    FirstName,
    MiddleName,
    LastName,
    Gender,
    Position,
    Department,
    ContactNumber,
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