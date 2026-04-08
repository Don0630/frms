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
  COALESCE(SUM(d.Amount), 0) AS TotalDistributed,
  COUNT(d.FarmerID) AS TotalFarmers
FROM tblSubsidyDistribution sd
JOIN tblPrograms p ON sd.ProgramID = p.ProgramID
LEFT JOIN tblSubsidyDistributionDetails d ON sd.DistributionID = d.DistributionID
GROUP BY sd.DistributionID, sd.DistributionDate, sd.ProgramID, p.ProgramName
ORDER BY sd.DistributionDate DESC
  `);

  return rows;
}



export async function getAllFarmerPerSubsidy(distributionID) {
  const [rows] = await db.query(`
    SELECT 
      f.FarmerID,
      f.FirstName,
      f.LastName,
      f.ContactNumber,
      f.Email,
      d.Amount
    FROM tblSubsidyDistributionDetails d
    JOIN tblFarmers f ON f.FarmerID = d.FarmerID
    WHERE d.DistributionID = ?
    ORDER BY f.LastName, f.FirstName
  `, [distributionID]);

  return rows;
}