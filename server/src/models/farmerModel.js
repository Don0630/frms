// server/src/models/farmerModel.js
import { db } from "../config/db.js";


// --------- GET ALL FARMER ---------
export async function getAllFarmer() {
  const [rows] = await db.query("SELECT * FROM tblFarmers ORDER BY FarmerID");
  return rows || null;
}



// --------- CREATE FARMER ---------
export async function createFarmer(farmer) {
  const {
    FirstName,
    MiddleName,
    LastName,
    Gender,
    DateOfBirth,
    Barangay,
    Municipality,
    Province,
    ContactNumber,
    Email,
    RegistrationDate
  } = farmer;

  const query = `
    INSERT INTO tblFarmers
    (FirstName,
    MiddleName,
    LastName,
    Gender,
    DateOfBirth,
    Barangay,
    Municipality,
    Province,
    ContactNumber,
    Email,
    RegistrationDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    FirstName,
    MiddleName,
    LastName,
    Gender,
    DateOfBirth,
    Barangay,
    Municipality,
    Province,
    ContactNumber,
    Email,
    RegistrationDate
  ];

  const [result] = await db.query(query, values);

  return {
    FarmerID: result.insertId,
    ...farmer
  };
}




// --------------- SEARCH FARMER (GENERAL) ---------------
export async function getSearchFarmers(search = "") {
  const searchPattern = `%${search}%`;

  const [rows] = await db.query(
    `
    SELECT 
      f.FarmerID,
      f.FirstName,
      f.LastName
    FROM tblFarmers f
    WHERE (f.FirstName LIKE ? OR f.LastName LIKE ?)
    ORDER BY f.FirstName, f.LastName
    LIMIT 3
    `,
    [searchPattern, searchPattern]
  );

  return rows || [];
}