// server/src/models/farmerModel.js
import { db } from "../config/db.js";


// --------- GET ALL FARMER ---------
export async function getAllFarmer() {
  const [rows] = await db.query(`
    SELECT 
      f.*,
      fr.FarmID, 
      fr.FarmBarangay,
      fr.FarmMunicipality,
      fr.FarmProvince,
      fr.FarmSize
    FROM tblFarmers f
    LEFT JOIN tblFarms fr ON f.FarmerID = fr.FarmerID
    ORDER BY f.FarmerID
  `);

  const map = new Map();

  for (const row of rows) {
    if (!map.has(row.FarmerID)) {
      map.set(row.FarmerID, {
        FarmerID: row.FarmerID,
        FirstName: row.FirstName,
        MiddleName: row.MiddleName,
        LastName: row.LastName,
        Gender: row.Gender,
        DateOfBirth: row.DateOfBirth,
        Barangay: row.Barangay,
        Municipality: row.Municipality,
        Province: row.Province,
        ContactNumber: row.ContactNumber,
        Email: row.Email,
        RegistrationDate: row.RegistrationDate,
        Farms: []
      });
    }

    if (row.FarmID) {
      map.get(row.FarmerID).Farms.push({
        FarmID: row.FarmID, 
        FarmBarangay: row.FarmBarangay,
        FarmMunicipality: row.FarmMunicipality,
        FarmProvince: row.FarmProvince,
        FarmSize: row.FarmSize
      });
    }
  }

  return Array.from(map.values());
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