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
export async function createStaff(staff) {
  const { FirstName, LastName, Gender, Position, Department, ContactNumber, } = staff;

  const query = `
    INSERT INTO tblAgriculturalStaff 
    (FirstName, LastName, Gender, Position, Department, ContactNumber)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [ FirstName, LastName, Gender, Position, Department, ContactNumber,
  ];

  const [result] = await db.query(query, values);

  return {
    StaffID: result.insertId,
    ...staff,
  };
}


export async function updateStaff(id, staff) {
  const { FirstName, LastName, Gender, Position, Department, ContactNumber } = staff;
  const query = `
    UPDATE tblAgriculturalStaff
    SET FirstName=?, LastName=?, Gender=?, Position=?, Department=?, ContactNumber=?
    WHERE StaffID=?
  `;
  const values = [FirstName, LastName, Gender, Position, Department, ContactNumber, id];
  const [result] = await db.query(query, values);
  return { StaffID: id, ...staff };
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
    LIMIT 1
    `,
    [searchPattern, searchPattern]
  );

  return rows;
}