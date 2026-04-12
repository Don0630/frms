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
    LastName,
    Gender,
    DateOfBirth,
    Address,
    ContactNumber,
    Email,
    FarmLocation,
    FarmSize,
    RegistrationDate
  } = farmer;

  const query = `
    INSERT INTO tblFarmers
    (FirstName, LastName, Gender, DateOfBirth, Address, ContactNumber, Email, FarmLocation, FarmSize, RegistrationDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    FirstName,
    LastName,
    Gender,
    DateOfBirth,
    Address,
    ContactNumber,
    Email,
    FarmLocation,
    FarmSize,
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