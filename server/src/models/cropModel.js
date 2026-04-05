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
