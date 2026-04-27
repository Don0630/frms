// server/src/models/programModel.js
import { db } from "../config/db.js";


// --------- GET ALL PROGRAM ---------
export async function getAllProgram() {
  const [rows] = await db.query("SELECT * FROM tblPrograms ORDER BY ProgramID");
  return rows || null;
}


// --------- CREATE PROGRAM ---------
export async function createProgram(program) {
  const { ProgramName, Description, StartDate, EndDate, Budget, TargetBeneficiaries, } = program;

  const query = `
    INSERT INTO tblPrograms 
    (ProgramName, Description, StartDate, EndDate, Budget, TargetBeneficiaries)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [ ProgramName, Description, StartDate, EndDate, Budget, TargetBeneficiaries, ];

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
    TargetBeneficiaries
  } = program;

  const query = `
    UPDATE tblPrograms
    SET
      ProgramName = ?,
      Description = ?,
      StartDate = ?,
      EndDate = ?,
      Budget = ?,
      TargetBeneficiaries = ?
    WHERE ProgramID = ?
  `;

  const values = [
    ProgramName,
    Description,
    StartDate,
    EndDate,
    Budget,
    TargetBeneficiaries,
    id
  ];

  const [result] = await db.query(query, values);

  return {
    ProgramID: id,
    ...program
  };
}





export async function getAvailablePrograms(search = "") {
  const searchPattern = `%${search}%`;

  const [rows] = await db.query(
    `
    SELECT 
      ProgramID,
      ProgramName
    FROM tblPrograms
    WHERE Status = 'Active'
      AND ProgramName LIKE ?
    ORDER BY ProgramName
    LIMIT 5
    `,
    [searchPattern, searchPattern]
  );

  return rows;
}