// server/src/models/subsidyModel.js
import { db } from "../config/db.js";



// --------- GET ALL SUBSIDY (WITH SUMMARY) ---------
export async function getAllSubsidy() {
  const [rows] = await db.query(`
    SELECT 
      d.DistributionID,
      d.TotalAmount,
      d.DistributionDate,
      d.Remarks,
      p.ProgramName,

      -- 💰 total distributed money
      COALESCE(SUM(
        CASE WHEN sd.IsDistributed = 1 THEN sd.Amount ELSE 0 END
      ), 0) AS TotalDistributed,

      -- 👨‍🌾 total assigned farmers (ALL farmers)
      COALESCE(COUNT(sd.FarmerID), 0) AS TotalFarmers,

      -- ✅ distributed farmers count (optional but useful)
      COALESCE(SUM(
        CASE WHEN sd.IsDistributed = 1 THEN 1 ELSE 0 END
      ), 0) AS DistributedFarmers

    FROM tblSubsidyDistribution d

    LEFT JOIN tblPrograms p 
      ON d.ProgramID = p.ProgramID

    LEFT JOIN tblSubsidyDistributionDetails sd 
      ON d.DistributionID = sd.DistributionID

    GROUP BY 
      d.DistributionID,
      d.TotalAmount,
      d.DistributionDate,
      d.Remarks,
      p.ProgramName

    ORDER BY d.DistributionDate DESC
  `);

  return rows || [];
}



// --------- CREATE SUBSIDY ---------
export async function createSubsidy(subsidy) {
  const { ProgramID, TotalAmount, DistributionDate, Remarks, } = subsidy;

  const query = `
    INSERT INTO tblSubsidyDistribution 
    (ProgramID, TotalAmount, DistributionDate, Remarks)
    VALUES (?, ?, ?, ?)
  `;

  const values = [ ProgramID, TotalAmount, DistributionDate, Remarks, ];

  const [result] = await db.query(query, values);

  return {
    DistributionID: result.insertId,
    ...subsidy,
  };
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




// --------------- SEARCH AVAILABLE FARMERS (NOT YET IN DISTRIBUTION) ---------------
export async function getAvailableFarmer(distributionID, search = "") {
  const searchPattern = `%${search}%`;

  const [rows] = await db.query(
    `
    SELECT 
      f.FarmerID,
      f.FirstName,
      f.LastName,
      f.Barangay,
      f.Municipality,
      f.ContactNumber
    FROM tblFarmers f
    WHERE NOT EXISTS (
      SELECT 1
      FROM tblSubsidyDistributionDetails d
      WHERE d.FarmerID = f.FarmerID
        AND d.DistributionID = ?
    )
    AND (
      f.FirstName LIKE ?
      OR f.LastName LIKE ?
    )
    ORDER BY f.FirstName, f.LastName
    LIMIT 5
    `,
    [
      distributionID,
      searchPattern,
      searchPattern,
    ]
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
export async function distributeSubsidy(id, distribute) {
  const { IsDistributed } = distribute;

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

 