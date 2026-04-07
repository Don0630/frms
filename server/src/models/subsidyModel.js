// server/src/models/subsidyModel.js
import { db } from "../config/db.js";


// --------- GET ALL SUBSIDY ---------
export async function getAllSubsidy() {
  const [rows] = await db.query(`
    SELECT 
      d.DistributionID,
      d.TotalAmount,
      d.DistributionDate,
      d.Remarks, 
      p.ProgramName
    FROM tblSubsidyDistribution d 
    LEFT JOIN tblPrograms p ON d.ProgramID = p.ProgramID
    ORDER BY d.DistributionID
  `);

  return rows || [];
}


 