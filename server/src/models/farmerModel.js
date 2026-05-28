// server/src/models/farmerModel.js
import { db } from "../config/db.js";

 
// --------- GET ALL FARMER ---------
export async function getAllFarmer() {
  const [rows] = await db.query(`
    SELECT 
      FarmerID,
      FirstName,
      MiddleName,
      LastName,
      Gender,
      DATE_FORMAT(DateOfBirth, '%Y-%m-%d') AS DateOfBirth,
      Barangay,
      Municipality,
      Province,
      ContactNumber,
      Email,
      DATE_FORMAT(RegistrationDate, '%Y-%m-%d') AS RegistrationDate
    FROM tblFarmers
    ORDER BY FarmerID
  `);

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
    Email
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
    Email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    Email
  ];

  const [result] = await db.query(query, values);

  return {
    FarmerID: result.insertId,
    ...farmer
  };
}


// --------- UPDATE FARMER ---------
export async function updateFarmer(id, farmer) {
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
    Email
  } = farmer;

  const query = `
    UPDATE tblFarmers
    SET 
      FirstName = ?,
      MiddleName = ?,
      LastName = ?,
      Gender = ?,
      DateOfBirth = ?,
      Barangay = ?,
      Municipality = ?,
      Province = ?,
      ContactNumber = ?,
      Email = ?
    WHERE FarmerID = ?
  `;

  const values = [
    FirstName,
    MiddleName || null,
    LastName,
    Gender,
    DateOfBirth,
    Barangay,
    Municipality,
    Province,
    ContactNumber,
    Email || null,
    id
  ];

  const [result] = await db.query(query, values);

  return {
    FarmerID: id,
    ...farmer
  };
}


// --------- DELETE FARMER ---------
export async function deleteFarmer(id) {
  const [result] = await db.query(
    `DELETE FROM tblFarmers WHERE FarmerID = ?`,
    [id]
  );
  return result;
}


// -------------------------------------------------- FARMER DETAILS --------------------------------------------------

// --------- GET FARMER BY ID ---------
export async function getFarmerById(id) {
  const [rows] = await db.query(
    `
    SELECT 
      f.FarmerID,
      f.FirstName,
      f.MiddleName,
      f.LastName,
      f.Gender,
      DATE_FORMAT(f.DateOfBirth, '%Y-%m-%d') AS DateOfBirth,
      f.Barangay,
      f.Municipality,
      f.Province,
      f.ContactNumber,
      f.Email,
      DATE_FORMAT(f.RegistrationDate, '%Y-%m-%d') AS RegistrationDate,
      fr.FarmID,
      fr.FarmBarangay,
      fr.FarmMunicipality,
      fr.FarmProvince,
      fr.FarmSize
    FROM tblFarmers f
    LEFT JOIN tblFarms fr ON f.FarmerID = fr.FarmerID
    WHERE f.FarmerID = ?
    `,
    [id]
  );

  if (rows.length === 0) return null;

  const farmer = {
    FarmerID: rows[0].FarmerID,
    FirstName: rows[0].FirstName,
    MiddleName: rows[0].MiddleName,
    LastName: rows[0].LastName,
    Gender: rows[0].Gender,
    DateOfBirth: rows[0].DateOfBirth,
    Barangay: rows[0].Barangay,
    Municipality: rows[0].Municipality,
    Province: rows[0].Province,
    ContactNumber: rows[0].ContactNumber,
    Email: rows[0].Email,
    RegistrationDate: rows[0].RegistrationDate,
    Farms: [],
  };

  for (const row of rows) {
    if (row.FarmID) {
      farmer.Farms.push({
        FarmID: row.FarmID,
        FarmerID: row.FarmerID,
        FarmBarangay: row.FarmBarangay,
        FarmMunicipality: row.FarmMunicipality,
        FarmProvince: row.FarmProvince,
        FarmSize: row.FarmSize,
      });
    }
  }

  return farmer;
}

// --------- CREATE FARM ---------
export async function createFarm(farm) {
  const {
    FarmerID, 
    FarmBarangay,
    FarmMunicipality,
    FarmProvince,
    FarmSize
  } = farm;

  const query = `
    INSERT INTO tblFarms
    (FarmerID, FarmBarangay, FarmMunicipality, FarmProvince, FarmSize)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    FarmerID, 
    FarmBarangay,
    FarmMunicipality,
    FarmProvince,
    FarmSize
  ];

  const [result] = await db.query(query, values);

  return {
    FarmID: result.insertId,
    ...farm
  };
}


// --------- UPDATE FARM ---------
export async function updateFarm(id, farm) {
  const {
    FarmBarangay,
    FarmMunicipality,
    FarmProvince,
    FarmSize
  } = farm;

  const query = `
    UPDATE tblFarms
    SET
      FarmBarangay = ?,
      FarmMunicipality = ?,
      FarmProvince = ?,
      FarmSize = ?
    WHERE FarmID = ?
  `;

  const values = [
    FarmBarangay,
    FarmMunicipality,
    FarmProvince,
    FarmSize,
    id
  ];

  const [result] = await db.query(query, values);

  return {
    FarmID: id,
    ...farm
  };
}


// --------- DELETE FARM ---------
export async function deleteFarm(id) {
  const query = `
    DELETE FROM tblFarms
    WHERE FarmID = ?
  `;

  const [result] = await db.query(query, [id]);

  return {
    FarmID: id,
    deleted: result.affectedRows > 0
  };
}


// --------------- SEARCH FARMER (GENERAL) --------------- 
export async function getSearchFarmer(search = "") {
  const searchPattern = `%${search}%`;
  const [rows] = await db.query(
    `
    SELECT 
      f.FarmerID,
      f.FirstName,
      f.MiddleName,
      f.LastName
    FROM tblFarmers f
    WHERE (
      CONCAT(f.FirstName, ' ', COALESCE(f.MiddleName, ''), ' ', f.LastName) LIKE ?
      OR
      CONCAT(f.LastName, ', ', f.FirstName, ' ', COALESCE(f.MiddleName, '')) LIKE ?
      OR
      CONCAT(f.LastName, ' ', f.FirstName) LIKE ?
    )
    ORDER BY f.FirstName, f.LastName
    LIMIT 10
    `,
    [searchPattern, searchPattern, searchPattern]
  );
  return rows || [];
}


// --------- CHECK FARM EXISTS ---------
export async function getFarmById(id) {
  const [rows] = await db.query(
    `
    SELECT FarmID, FarmerID
    FROM tblFarms
    WHERE FarmID = ?
    LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}
 