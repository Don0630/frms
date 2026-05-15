import { throwError } from "../utils/throwError.js";
import * as validators from "../utils/validators.js";

// ---------------------- ADD SUBSIDY ----------------------
export function validateAddSubsidy(req, res, next) {
  try {
    validators.validateRequiredFields(req.body,
      ["ProgramID", "TotalAmount", "DistributionDate", "Remarks"],
      {
        ProgramID: "Program",
        TotalAmount: "Total amount",
        DistributionDate: "Distribution date",
        Remarks: "Remarks",
      }
    );

    validators.validatePositiveNumber(req.body.TotalAmount, "Total amount");

    next();
  } catch (err) {
    next(err);
  }
}




// ---------------------- EDIT SUBSIDY ----------------------
export function validateEditSubsidy(req, res, next) {
  try {
    if (!req.params.id) {
      throwError("Subsidy ID is required", "MISSING_ID", 400);
    }

    validators.validateRequiredFields(req.body,
      ["TotalAmount", "DistributionDate", "Remarks"],
      {
        TotalAmount: "Total amount",
        DistributionDate: "Distribution date",
        Remarks: "Remarks",
      }
    );

    validators.validateID(req.params.id, "Subsidy ID");

    validators.validatePositiveNumber(req.body.TotalAmount, "Total amount");

    next();
  } catch (err) {
    next(err);
  }
}

// ---------------------- ADD DISTRIBUTION ----------------------
export function validateAddDistribution(req, res, next) {
  try {
    validators.validateRequiredFields(req.body,
      ["DistributionID", "FarmerID", "Amount"],
      {
        DistributionID: "Distribution",
        FarmerID: "Farmer",
        Amount: "Amount",
      }
    );

    validators.validateID(req.body.DistributionID, "Distribution ID");
    validators.validateID(req.body.FarmerID, "Farmer ID");

    validators.validatePositiveNumber(req.body.Amount, "Amount");

    next();
  } catch (err) {
    next(err);
  }
}