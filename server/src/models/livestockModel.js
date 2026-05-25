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

// --------- UPDATE LIVESTOCK ---------
export async function updateLivestock(id, livestock) {
  const {
    Type,
    Breed,
    AverageProduction,
    MarketPrice
  } = livestock;

  const query = `
    UPDATE tblLivestock
    SET
      Type = ?,
      Breed = ?,
      AverageProduction = ?,
      MarketPrice = ?
    WHERE LivestockID = ?
  `;

  const values = [
    Type,
    Breed,
    AverageProduction,
    MarketPrice,
    id
  ];

  const [result] = await db.query(query, values);

  return {
    LivestockID: id,
    ...livestock
  };
}

// --------- DELETE LIVESTOCK ---------
export async function deleteLivestock(id) {
  const [result] = await db.query(
    `DELETE FROM tblLivestock WHERE LivestockID = ?`,
    [id]
  );
  return result;
}


// --------------- SEARCH LIVESTOCK (GENERAL) ---------------
export async function getSearchLivestock(search = "") {
  const searchPattern = `%${search}%`;
  const [rows] = await db.query(
    `
    SELECT 
      l.LivestockID,
      l.Type,
      l.Breed
    FROM tblLivestock l
    WHERE (
      l.Type LIKE ?
      OR l.Breed LIKE ?
      OR CONCAT(l.Type, ' - ', l.Breed) LIKE ?
      OR CONCAT(l.Type, ' ', l.Breed) LIKE ?
    )
    ORDER BY l.Type, l.Breed
    LIMIT 10
    `,
    [searchPattern, searchPattern, searchPattern, searchPattern]
  );
  return rows || [];
}



// --------- GET LIVESTOCK BY ID ---------
export async function getLivestockById(id) {
  const [rows] = await db.query(
    `SELECT LivestockID FROM tblLivestock WHERE LivestockID = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}



// --------- FIND DUPLICATE LIVESTOCK ---------
export async function findDuplicateLivestock(Type, Breed, excludeId = null) {
  const [rows] = await db.query(
    `
    SELECT LivestockID
    FROM tblLivestock
    WHERE Type = ?
      AND Breed = ?
      AND (? IS NULL OR LivestockID != ?)
    LIMIT 1
    `,
    [Type, Breed, excludeId, excludeId]
  );
  return rows[0] || null;
}