// server/src/models/cropModel.js
import { db } from "../config/db.js";


// --------- GET ALL CROP ---------
export async function getAllCrop() {
  const [rows] = await db.query("SELECT * FROM tblCrops ORDER BY CropID");
  return rows || null;
}


 
// --------- CREATE CROP ---------
export async function createCrop(crop) {
  const { CropName, Category, Season, AverageYieldPerHectare, MarketPrice, } = crop;

  const query = `
    INSERT INTO tblCrops 
    (CropName, Category, Season, AverageYieldPerHectare, MarketPrice)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [ CropName, Category, Season, AverageYieldPerHectare, MarketPrice
  ];

  const [result] = await db.query(query, values);

  return {
    CropID: result.insertId,
    ...crop,
  };
}



// --------- UPDATE CROP ---------
export async function updateCrop(id, crop) {
  const {
    CropName,
    Category,
    Season,
    AverageYieldPerHectare,
    MarketPrice,
  } = crop;

  const query = `
    UPDATE tblCrops
    SET
      CropName = ?,
      Category = ?,
      Season = ?,
      AverageYieldPerHectare = ?,
      MarketPrice = ?
    WHERE CropID = ?
  `;

  const values = [
    CropName,
    Category,
    Season,
    AverageYieldPerHectare,
    MarketPrice,
    id,
  ];

  await db.query(query, values);

  return {
    CropID: id,
    ...crop,
  };
}


// --------------- SEARCH CROP (GENERAL) ---------------
export async function getSearchCrop(search = "") {
  const searchPattern = `%${search}%`;

  const [rows] = await db.query(
    `
    SELECT 
      c.CropID,
      c.CropName
    FROM tblCrops c
    WHERE (c.CropName LIKE ?)
    ORDER BY c.CropName
    LIMIT 3
    `,
    [searchPattern, searchPattern]
  );

  return rows || [];
}