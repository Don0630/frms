// server/src/models/programModel.js
import { db } from "../config/db.js";


// --------- GET ALL PROGRAM ---------
export async function getAllProgram() {
  const [rows] = await db.query(`
    SELECT
      p.ProgramID,
      p.ProgramName,
      p.Description,
      DATE_FORMAT(p.StartDate, '%Y-%m-%d') AS StartDate,
      DATE_FORMAT(p.EndDate, '%Y-%m-%d') AS EndDate,
      p.Budget,
      p.TargetBeneficiaries,
      p.Status,

      -- 💰 total already distributed (IsDistributed = 1)
      COALESCE(SUM(
        CASE WHEN dd.IsDistributed = 1 THEN dd.Amount ELSE 0 END
      ), 0) AS TotalDistributed,

      -- ⏳ pending distributions (IsDistributed = 0)
      COALESCE(SUM(
        CASE WHEN dd.IsDistributed = 0 THEN 1 ELSE 0 END
      ), 0) AS PendingDistributions

    FROM tblPrograms p

    LEFT JOIN tblSubsidyDistribution d
      ON p.ProgramID = d.ProgramID

    LEFT JOIN tblSubsidyDistributionDetails dd
      ON d.DistributionID = dd.DistributionID

    GROUP BY
      p.ProgramID,
      p.ProgramName,
      p.Description,
      p.StartDate,
      p.EndDate,
      p.Budget,
      p.TargetBeneficiaries,
      p.Status

    ORDER BY p.ProgramID
  `);

  return rows;
}


// --------- CREATE PROGRAM ---------
export async function createProgram(program) {
  const { ProgramName, Description, StartDate, EndDate, Budget, TargetBeneficiaries, Status } = program;

  const query = `
    INSERT INTO tblPrograms 
    (ProgramName, Description, StartDate, EndDate, Budget, TargetBeneficiaries, Status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [ProgramName, Description, StartDate, EndDate, Budget, TargetBeneficiaries, Status];

  const [result] = await db.query(query, values);

  return {
    ProgramID: result.insertId,
    ...program,
  };
}


// --------- UPDATE PROGRAM --------- 
export async function updateProgram(id, program) {
  const {
    ProgramName,
    Description,
    StartDate,
    EndDate,
    Budget,
    TargetBeneficiaries,
    Status,
  } = program;

  const query = `
    UPDATE tblPrograms
    SET
      ProgramName = ?,
      Description = ?,
      StartDate = ?,
      EndDate = ?,
      Budget = ?,
      TargetBeneficiaries = ?,
      Status = ?
    WHERE ProgramID = ?
  `;

  const values = [
    ProgramName,
    Description,
    StartDate,
    EndDate,
    Budget,
    TargetBeneficiaries,
    Status,
    id
  ];

  const [result] = await db.query(query, values);

  return {
    ProgramID: id,
    ...program
  };
}

// --------- DELETE PROGRAM ---------
export async function deleteProgram(id) {
  const [result] = await db.query(
    `DELETE FROM tblPrograms WHERE ProgramID = ?`,
    [id]
  );
  return result;
}


// --------- SEARH - GET AVAILABLE PROGRAM ---------
export async function getAvailablePrograms(search = "") {
  const searchPattern = `%${search}%`;

  const [rows] = await db.query(
    `
    SELECT 
      p.ProgramID,
      p.ProgramName,
      p.Budget,
      DATE_FORMAT(p.StartDate, '%Y-%m-%d') AS StartDate,
      DATE_FORMAT(p.EndDate, '%Y-%m-%d') AS EndDate,
      -- 💵 total subsidy already added
      COALESCE(SUM(d.TotalAmount), 0) AS TotalSubsidy,

      -- 🏦 available amount
      p.Budget - COALESCE(SUM(d.TotalAmount), 0) AS AvailableBudget

    FROM tblPrograms p

    LEFT JOIN tblSubsidyDistribution d
      ON p.ProgramID = d.ProgramID

    WHERE p.Status = 'Active'
      AND p.ProgramName LIKE ?

    GROUP BY p.ProgramID, p.ProgramName, p.Budget

    ORDER BY p.ProgramName
    LIMIT 5
    `,
    [searchPattern]
  );

  return rows;
}


// ---------------------------- VALIDATIONS ---------------------------- 


// --------- GET PROGRAM BY ID ---------
export async function getProgramById(id) {
  const [rows] = await db.query(
    `
    SELECT ProgramID, Status, Budget,
      DATE_FORMAT(StartDate, '%Y-%m-%d') AS StartDate,
      DATE_FORMAT(EndDate, '%Y-%m-%d') AS EndDate
    FROM tblPrograms 
    WHERE ProgramID = ? 
    LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}


// --------- GET TOTAL DISTRIBUTED AMOUNT ---------
export async function getTotalDistributed(programId) {
  const [rows] = await db.query(
    `
    SELECT COALESCE(SUM(dd.Amount), 0) AS TotalDistributed
    FROM tblSubsidyDistribution d
    JOIN tblSubsidyDistributionDetails dd
      ON d.DistributionID = dd.DistributionID
    WHERE d.ProgramID = ?
      AND dd.IsDistributed = 1
    `,
    [programId]
  );
  return rows[0].TotalDistributed;
}


// --------- GET ACTIVE DISTRIBUTIONS ---------
export async function getActiveDistributions(programId) {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS count
    FROM tblSubsidyDistribution d
    JOIN tblSubsidyDistributionDetails dd
      ON d.DistributionID = dd.DistributionID
    WHERE d.ProgramID = ?
      AND dd.IsDistributed = 0
    `,
    [programId]
  );
  return rows[0].count;
}