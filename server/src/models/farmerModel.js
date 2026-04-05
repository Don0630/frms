// server/src/models/farmerModel.js
import { db } from "../config/db.js";


// --------- GET ALL STAFF ---------
export async function getAllFarmer() {
  const [rows] = await db.query("SELECT * FROM tblFarmers ORDER BY FarmerID");
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