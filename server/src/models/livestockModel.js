// server/src/models/livestockModel.js
import { db } from "../config/db.js";


// --------- GET ALL LIVESTOCK ---------
export async function getAllLivestock() {
  const [rows] = await db.query("SELECT * FROM tblLivestock ORDER BY LivestockID");
  return rows || null;
}


// --------- CREATE LIVESTOCK ---------
export async function createLivestock(livestock) {
  const { Type, Breed, AverageProduction, MarketPrice, } = livestock;

  const query = `
    INSERT INTO tblLivestock 
    (Type, Breed, AverageProduction, MarketPrice)
    VALUES (?, ?, ?, ?)
  `;
  const values = [ Type, Breed, AverageProduction, MarketPrice, ];
  const [result] = await db.query(query, values);

  return {
    LivestockID: result.insertId,
    ...livestock,
  };
}

 