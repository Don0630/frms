// server/src/models/subsidyModel.js
import { db } from "../config/db.js";



// --------- GET ALL SUBSIDY (WITH SUMMARY) ---------
export async function getAllSubsidy() {
  const [rows] = await db.query(`
    SELECT 
      d.DistributionID,
      d.ProgramID,
      d.TotalAmount,
      DATE_FORMAT(d.DistributionDate, '%Y-%m-%d') AS DistributionDate,
      d.Remarks,
      p.ProgramName,
      p.Budget AS ProgramBudget,
      DATE_FORMAT(p.StartDate, '%Y-%m-%d') AS ProgramStartDate,
      DATE_FORMAT(p.EndDate, '%Y-%m-%d') AS ProgramEndDate,    

      -- 💰 total distributed money
      COALESCE(SUM(
        CASE WHEN sd.IsDistributed = 1 THEN sd.Amount ELSE 0 END
      ), 0) AS TotalDistributed,

      -- 👨‍🌾 total assigned farmers
      COALESCE(COUNT(sd.FarmerID), 0) AS TotalFarmers,

      -- ✅ distributed farmers count
      COALESCE(SUM(
        CASE WHEN sd.IsDistributed = 1 THEN 1 ELSE 0 END
      ), 0) AS DistributedFarmers,

      -- 💵 total subsidy for this program (across all distributions)
      COALESCE((
        SELECT SUM(TotalAmount)
        FROM tblSubsidyDistribution
        WHERE ProgramID = d.ProgramID
      ), 0) AS TotalSubsidy,

      -- 🏦 remaining budget
      p.Budget - COALESCE((
        SELECT SUM(TotalAmount)
        FROM tblSubsidyDistribution
        WHERE ProgramID = d.ProgramID
      ), 0) AS RemainingBudget,

      -- 💵 available budget excluding self (for edit validation) 👈
      p.Budget - COALESCE((
        SELECT SUM(TotalAmount)
        FROM tblSubsidyDistribution
        WHERE ProgramID = d.ProgramID
          AND DistributionID != d.DistributionID
      ), 0) AS AvailableBudget

    FROM tblSubsidyDistribution d

    LEFT JOIN tblPrograms p 
      ON d.ProgramID = p.ProgramID

    LEFT JOIN tblSubsidyDistributionDetails sd 
      ON d.DistributionID = sd.DistributionID

    GROUP BY 
      d.DistributionID,
      d.ProgramID,
      d.TotalAmount,
      d.DistributionDate,
      d.Remarks,
      p.ProgramName,
      p.Budget,
      p.StartDate,
      p.EndDate   

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


// --------- UPDATE SUBSIDY ---------
export async function updateSubsidy(id, subsidy) {
  const { TotalAmount, DistributionDate, Remarks } = subsidy;

  const query = `
    UPDATE tblSubsidyDistribution
    SET
      TotalAmount = ?,
      DistributionDate = ?,
      Remarks = ?
    WHERE DistributionID = ?
  `;

  const values = [TotalAmount, DistributionDate, Remarks, id];

  await db.query(query, values);

  return {
    DistributionID: id,
    ...subsidy,
  };
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




// --------- CREATE FARMER DISTRIBUTION ---------
export async function createDistribution(distribution) {
  const {
    DistributionID,
    FarmerID,
    Amount
  } = distribution;

  const query = `
    INSERT INTO tblSubsidyDistributionDetails
    (DistributionID, FarmerID, Amount)
    VALUES (?, ?, ?)
  `;

  const values = [ DistributionID, FarmerID, Amount ];

  const [result] = await db.query(query, values);

  return {
    DistributionDetailsID: result.insertId,
    ...distribution
  };
}

 
// --------- UPDATE SUBSIDY DISTRIBUTION ---------
export async function updateDistribution(id, distribution) {
  const { IsDistributed } = distribution;

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




// --------- DELETE DISTRIBUTION ---------
export async function deleteDistribution(id) {
  const query = `
    DELETE FROM tblSubsidyDistributionDetails
    WHERE DistributionDetailsID = ?
  `;

  const [result] = await db.query(query, [id]);

  return {
    DistributionDetailsID: id,
    deleted: result.affectedRows > 0
  };
}



// --------- GET SUBSIDY DETAILS ---------
export async function getSubsidyDetails(id) {
  const [rows] = await db.query(
    `
    SELECT 
      d.DistributionID,
      d.ProgramID,
      d.TotalAmount, 
      DATE_FORMAT(d.DistributionDate, '%Y-%m-%d') AS DistributionDate,
      d.Remarks,

      p.ProgramName,

      sd.DistributionDetailsID,
      sd.Amount,
      sd.IsDistributed,

      f.FarmerID,
      f.FirstName,
      f.LastName,
      f.ContactNumber,
      f.Email

    FROM tblSubsidyDistribution d

    LEFT JOIN tblPrograms p
      ON d.ProgramID = p.ProgramID

    LEFT JOIN tblSubsidyDistributionDetails sd
      ON d.DistributionID = sd.DistributionID

    LEFT JOIN tblFarmers f
      ON sd.FarmerID = f.FarmerID

    WHERE d.DistributionID = ?
    `,
    [id]
  );

  if (rows.length === 0) return null;

  const subsidy = {
    DistributionID: rows[0].DistributionID,
    ProgramID: rows[0].ProgramID,
    ProgramName: rows[0].ProgramName,
    TotalAmount: rows[0].TotalAmount,
    DistributionDate: rows[0].DistributionDate,
    Remarks: rows[0].Remarks,
    Farmers: [],
  };

  for (const row of rows) {
    if (row.FarmerID) {
      subsidy.Farmers.push({
        DistributionDetailsID: row.DistributionDetailsID,
        FarmerID: row.FarmerID,
        FirstName: row.FirstName,
        LastName: row.LastName,
        ContactNumber: row.ContactNumber,
        Email: row.Email,
        Amount: row.Amount,
        IsDistributed: row.IsDistributed,
      });
    }
  }

  return subsidy;
}



// ----------------------------- VALIDATIONS -----------------------------



// --------- GET SUBSIDY BY ID ---------
export async function getSubsidyById(id) {
  const [rows] = await db.query(
    `
    SELECT 
      d.DistributionID,
      d.ProgramID,
      d.TotalAmount,
      DATE_FORMAT(d.DistributionDate, '%Y-%m-%d') AS DistributionDate,
      d.Remarks,
      -- check if any farmer has been distributed
      COALESCE(SUM(
        CASE WHEN sd.IsDistributed = 1 THEN 1 ELSE 0 END
      ), 0) AS DistributedCount
    FROM tblSubsidyDistribution d
    LEFT JOIN tblSubsidyDistributionDetails sd
      ON d.DistributionID = sd.DistributionID
    WHERE d.DistributionID = ?
    GROUP BY 
      d.DistributionID,
      d.ProgramID,
      d.TotalAmount,
      d.DistributionDate,
      d.Remarks
    `,
    [id]
  );
  return rows[0] || null;
}


// --------- GET TOTAL SUBSIDY BY PROGRAM ---------
export async function getTotalSubsidyByProgram(programId, excludeId = null) {
  const [rows] = await db.query(
    `
    SELECT COALESCE(SUM(TotalAmount), 0) AS TotalSubsidy
    FROM tblSubsidyDistribution
    WHERE ProgramID = ?
      AND (? IS NULL OR DistributionID != ?)
    `,
    [programId, excludeId, excludeId]
  );
  return rows[0].TotalSubsidy;
}


// --------- GET TOTAL ASSIGNED AMOUNT ---------
export async function getTotalAssignedAmount(distributionID) {
  const [rows] = await db.query(
    `
    SELECT COALESCE(SUM(Amount), 0) AS TotalAssigned
    FROM tblSubsidyDistributionDetails
    WHERE DistributionID = ?
    `,
    [distributionID]
  );
  return rows[0].TotalAssigned;
}