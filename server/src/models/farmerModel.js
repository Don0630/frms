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


export async function getAvailableFarmer(distributionID, search = "") {
  const searchPattern = `%${search}%`;

  const [rows] = await db.query(
    `
    SELECT 
      f.FarmerID,
      f.FirstName,
      f.LastName,
      f.FarmLocation,
      f.ContactNumber
    FROM tblFarmers f
    LEFT JOIN tblSubsidyDistributionDetails d
      ON f.FarmerID = d.FarmerID 
      AND d.DistributionID = ?
    WHERE d.FarmerID IS NULL
      AND (f.FirstName LIKE ? OR f.LastName LIKE ?)
    ORDER BY f.FirstName, f.LastName
    LIMIT 10
    `,
    [distributionID, searchPattern, searchPattern]
  );

  return rows || [];
}