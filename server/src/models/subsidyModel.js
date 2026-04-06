// server/src/models/subsidyModel.js
import { db } from "../config/db.js";


// --------- GET ALL SUBSIDY ---------
export async function getAllSubsidy() {
  const [rows] = await db.query(`
    SELECT 
      d.DistributionID,
      d.Amount,
      d.DistributionDate,
      d.Remarks,
      f.FirstName,
      f.LastName,
      f.Gender,
      p.ProgramName
    FROM tblSubsidyDistribution d
    LEFT JOIN tblFarmers f ON d.FarmerID = f.FarmerID
    LEFT JOIN tblPrograms p ON d.ProgramID = p.ProgramID
    ORDER BY d.DistributionID
  `);

  return rows || [];
}


 