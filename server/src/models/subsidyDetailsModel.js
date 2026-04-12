// server/src/models/subsidyModel.js
import { db } from "../config/db.js";

// Get subsidies summary only
export async function getAllSubsidyDetails() {
  const [rows] = await db.query(`
    SELECT 
      sd.DistributionID,
      sd.DistributionDate,
      sd.ProgramID,
      sd.TotalAmount,
      p.ProgramName,

      COALESCE(SUM(CASE 
        WHEN d.IsDistributed = 1 THEN d.Amount 
        ELSE 0 
      END), 0) AS TotalDistributed,

      COUNT(CASE 
        WHEN d.IsDistributed = 1 THEN d.FarmerID 
      END) AS TotalFarmers

    FROM tblSubsidyDistribution sd
    JOIN tblPrograms p 
      ON sd.ProgramID = p.ProgramID

    LEFT JOIN tblSubsidyDistributionDetails d 
      ON sd.DistributionID = d.DistributionID

    GROUP BY 
      sd.DistributionID,
      sd.DistributionDate,
      sd.ProgramID,
      sd.TotalAmount,
      p.ProgramName

    ORDER BY sd.DistributionDate DESC
  `);

  return rows;
}


// ------------------ GET FARMER PER SUBSIDY ------------------
export async function getAllFarmerPerSubsidy(distributionID) {
  const [rows] = await db.query(`
    SELECT 
      f.FarmerID,
      f.FirstName,
      f.LastName,
      f.ContactNumber,
      f.Email,
      d.DistributionDetailsID,
      d.IsDistributed,
      d.Amount      
    FROM tblSubsidyDistributionDetails d
    JOIN tblFarmers f ON f.FarmerID = d.FarmerID
    WHERE d.DistributionID = ?
    ORDER BY f.LastName, f.FirstName
  `, [distributionID]);

  return rows;
}


 

// --------------- SEARCH FARMER WITHOUT SUBSIDY DETAILS ---------------
export async function getAvailableFarmer(distributionID, search = "") {
  const searchPattern = `%${search}%`;

  const [rows] = await db.query(
    `
    SELECT 
      f.FarmerID,
      f.FirstName,
      f.LastName,
      f.FarmLocation,
      f.ContactNumber
    FROM tblFarmers f
    LEFT JOIN tblSubsidyDistributionDetails d
      ON f.FarmerID = d.FarmerID 
      AND d.DistributionID = ?
    WHERE d.FarmerID IS NULL
      AND (f.FirstName LIKE ? OR f.LastName LIKE ?)
    ORDER BY f.FirstName, f.LastName
    LIMIT 10
    `,
    [distributionID, searchPattern, searchPattern]
  );

  return rows || [];
}



// --------- CREATE FARMER SUBSIDY ---------
export async function createFarmerSubsidy(farmerSubsidy) {
  const {
    DistributionID,
    FarmerID,
    Amount
  } = farmerSubsidy;

  const query = `
    INSERT INTO tblSubsidyDistributionDetails
    (DistributionID, FarmerID, Amount)
    VALUES (?, ?, ?)
  `;

  const values = [ DistributionID, FarmerID, Amount ];

  const [result] = await db.query(query, values);

  return {
    DistributionDetailsID: result.insertId,
    ...farmerSubsidy
  };
}

 
// --------- DISTRIBUTE SUBSIDY ---------
export async function distributeSubsidy(id, data) {
  const { IsDistributed } = data;

  const query = `
    UPDATE tblSubsidyDistributionDetails
    SET IsDistributed = ?
    WHERE DistributionDetailsID = ?
  `;

  const values = [IsDistributed, id];

  const [result] = await db.query(query, values);

  return {
    DistributionDetailsID: id,
    IsDistributed,
  };
}

 