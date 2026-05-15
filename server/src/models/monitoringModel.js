// server/src/models/monitoringModel.js
import { db } from "../config/db.js";


// --------- GET ALL MONITORING ---------
export async function getAllMonitoring() {
  const [rows] = await db.query(`
    SELECT 
      r.ReportID, 
      DATE_FORMAT(r.ReportDate, '%Y-%m-%d') AS ReportDate,
      r.ProductionVolume,
      r.Issues,
      r.Remarks,
      f.FarmerID,
      f.FirstName,
      f.MiddleName,
      f.LastName,
      f.Gender,
      c.CropID,
      c.CropName,
      l.LivestockID,
      l.Type,
      l.Breed
    FROM tblReportsAndMonitoring r
    LEFT JOIN tblFarmers f ON r.FarmerID = f.FarmerID
    LEFT JOIN tblCrops c ON r.CropID = c.CropID
    LEFT JOIN tblLivestock l ON r.LivestockID = l.LivestockID
    ORDER BY r.ReportID
  `);
  return rows || [];
}


// --------- CREATE MONITORING ---------
export async function createMonitoring(monitoring) {
  const { FarmerID, CropID, LivestockID, ReportDate, ProductionVolume, Issues, Remarks } = monitoring;

  const query = `
    INSERT INTO tblReportsAndMonitoring 
    (FarmerID, CropID, LivestockID, ReportDate, ProductionVolume, Issues, Remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [ FarmerID, CropID, LivestockID, ReportDate, ProductionVolume, Issues, Remarks ];

  const [result] = await db.query(query, values);

  return {
    ReportID: result.insertId,
    ...monitoring,
  };
}




// --------- UPDATE MONITORING ---------
export async function updateMonitoring(id, monitoring) {
  const {
    FarmerID,
    CropID,
    LivestockID,
    ReportDate,
    ProductionVolume,
    Issues,
    Remarks,
  } = monitoring;

  const query = `
    UPDATE tblReportsAndMonitoring
    SET
      FarmerID = ?,
      CropID = ?,
      LivestockID = ?,
      ReportDate = ?,
      ProductionVolume = ?,
      Issues = ?,
      Remarks = ?
    WHERE ReportID = ?
  `;

  const values = [
    FarmerID,
    CropID,
    LivestockID,
    ReportDate,
    ProductionVolume,
    Issues,
    Remarks,
    id,
  ];

  const [result] = await db.query(query, values);

  return {
    ReportID: id,
    ...monitoring,
  };
}



// --------- FIND DUPLICATE MONITORING ---------
export async function findDuplicateMonitoring(FarmerID, ReportDate, excludeId = null) {
  const [rows] = await db.query(
    `
    SELECT ReportID
    FROM tblReportsAndMonitoring
    WHERE FarmerID = ?
      AND ReportDate = ?
      AND (? IS NULL OR ReportID != ?)
    LIMIT 1
    `,
    [FarmerID, ReportDate, excludeId, excludeId]
  );
  return rows[0] || null;
}