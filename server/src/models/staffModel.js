// server/src/models/staffModel.js
import { db } from "../config/db.js";


// --------- GET ALL STAFF ---------
export async function getAllStaff() {
  const [rows] = await db.query("SELECT * FROM tblAgriculturalStaff ORDER BY StaffID");
  return rows || null;
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