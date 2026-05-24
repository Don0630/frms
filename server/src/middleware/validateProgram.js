import { throwError } from "../utils/throwError.js";
import * as validators from "../utils/validators.js";

// ---------------------- STATUS VALIDATOR ----------------------
export function validateProgramStatus(status) {
  const allowedStatuses = ["Active", "Completed", "Dropped"];
  if (!allowedStatuses.includes(status)) {
    throwError("Invalid status selected", "INVALID_STATUS", 400);
  }
}

// ---------------------- DATE RANGE ----------------------
function validateProgramDateRange(startDate, endDate, isEdit = false) {
  if (!startDate || !endDate) {
    throwError("Start date and end date are required", "INVALID_DATE", 400);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (!isEdit && start < today) {
    throwError("Start date cannot be in the past", "INVALID_DATE", 400);
  }

  if (end <= start) {
    throwError("End date must be after start date", "INVALID_DATE", 400);
  }

  const minEnd = new Date(start);
  minEnd.setMonth(minEnd.getMonth() + 1);

  const maxEnd = new Date(start);
  maxEnd.setFullYear(maxEnd.getFullYear() + 1);

  if (end < minEnd) {
    throwError("End date must be at least 1 month after start date", "INVALID_DATE", 400);
  }

  if (end > maxEnd) {
    throwError("End date cannot exceed 1 year after start date", "INVALID_DATE", 400);
  }
}



// ---------------------- ADD PROGRAM ----------------------
export function validateAddProgram(req, res, next) {
  try {
    validators.validateRequiredFields(req.body,
      ["ProgramName", "StartDate", "EndDate", "Budget", "TargetBeneficiaries"],
      {
        ProgramName: "Program name",
        StartDate: "Start date",
        EndDate: "End date",
        Budget: "Budget",
        TargetBeneficiaries: "Target beneficiaries",
      }
    );

    validateProgramDateRange(req.body.StartDate, req.body.EndDate);
    validators.validatePositiveNumber(req.body.Budget, "Budget");
    validators.validatePositiveNumber(req.body.TargetBeneficiaries, "Target beneficiaries");

    next();
  } catch (err) {
    next(err);
  }
}

// ---------------------- EDIT PROGRAM ----------------------
export function validateEditProgram(req, res, next) {
  try {
    if (!req.params.id) {
      throwError("Program ID is required", "MISSING_ID", 400);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      throwError("Invalid Program ID", "INVALID_ID", 400);
    }

    validators.validateRequiredFields(req.body,
        ["ProgramName", "StartDate", "EndDate", "Budget", "TargetBeneficiaries", "Status"],
        {
            ProgramName: "Program name",
            StartDate: "Start date",
            EndDate: "End date",
            Budget: "Budget",
            TargetBeneficiaries: "Target beneficiaries",
            Status: "Status",
        }
    );

    validateProgramDateRange(req.body.StartDate, req.body.EndDate, true);
    validateProgramStatus(req.body.Status);
    validators.validatePositiveNumber(req.body.Budget, "Budget");
    validators.validatePositiveNumber(req.body.TargetBeneficiaries, "Target beneficiaries");


    next();
  } catch (err) {
    next(err);
  }
}




// ---------------------- DELETE PROGRAM ----------------------
export function validateDeleteProgram(req, res, next) {
  try {
    if (!req.params.id) {
      throwError("Program ID is required", "MISSING_ID", 400);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      throwError("Invalid Program ID", "INVALID_ID", 400);
    }

    next();
  } catch (err) {
    next(err);
  }
}
