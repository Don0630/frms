// server/src/models/subsidyModel.js
import { db } from "../config/db.js";

// Get subsidies summary only
export async function getAllSubsidyDetails() {
  const [rows] = await db.query(`
    SELECT 
      sd.DistributionID,
      sd.DistributionDate,
      sd.ProgramID,
      p.ProgramName,
      SUM(d.Amount) AS TotalDistributed,
      COUNT(d.FarmerID) AS TotalFarmers
    FROM tblSubsidyDistribution sd
    JOIN tblPrograms p ON sd.ProgramID = p.ProgramID
    JOIN tblSubsidyDistributionDetails d ON sd.DistributionID = d.DistributionID
    GROUP BY sd.DistributionID, sd.DistributionDate, sd.ProgramID, p.ProgramName
    ORDER BY sd.DistributionDate DESC
  `);

  return rows;
}