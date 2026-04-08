// server/src/models/monitoringModel.js
import { db } from "../config/db.js";


// --------- GET ALL MONITORING ---------
export async function getAllMonitoring() {
  const [rows] = await db.query(`
    SELECT 
      r.ReportID,
      r.ReportDate,
      r.ProductionVolume,
      r.Issues,
      r.Remarks,
      f.FirstName,
      f.LastName,
      f.Gender,
      c.CropName,
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
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [ FarmerID, CropID, LivestockID, ReportDate, ProductionVolume, Issues, Remarks ];

  const [result] = await db.query(query, values);

  return {
    ReportID: result.insertId,
    ...monitoring,
  };
}

