import * as validators from "../utils/validators.js";
import { throwError } from "../utils/throwError.js";

// ---------------------- ADD MONITORING ----------------------
export function validateAddMonitoring(req, res, next) {
  try {
    validators.validateRequiredFields(
      req.body,
      ["FarmerID", "ReportDate", "ProductionVolume", "Issues", "Remarks"],
      {
        FarmerID: "Farmer",
        ReportDate: "Report date",
        ProductionVolume: "Production volume",
        Issues: "Issues",
        Remarks: "Remarks",
      }
    );
    validators.validateID(req.body.FarmerID, "Farmer ID");
    if (req.body.CropID) validators.validateID(req.body.CropID, "Crop ID");
    if (req.body.LivestockID) validators.validateID(req.body.LivestockID, "Livestock ID");
    validators.validatePositiveNumber(req.body.ProductionVolume, "Production volume");

    next();
  } catch (err) {
    next(err);
  }
}


// ---------------------- EDIT MONITORING ----------------------
export function validateEditMonitoring(req, res, next) {
  try {
    // validate params
    if (!req.params.id) {
      throwError("Report ID is required", "MISSING_ID", 400);
    }

    validators.validateID(req.params.id, "Monitoring ID");

    // required fields
    validators.validateRequiredFields(
      req.body,
      ["FarmerID", "ReportDate", "ProductionVolume", "Issues", "Remarks"],
      {
        FarmerID: "Farmer",
        ReportDate: "Report date",
        ProductionVolume: "Production volume",
        Issues: "Issues",
        Remarks: "Remarks",
      }
    );

    if (req.body.CropID) validators.validateID(req.body.CropID, "Crop ID");
    if (req.body.LivestockID) validators.validateID(req.body.LivestockID, "Livestock ID");
    validators.validatePositiveNumber(req.body.ProductionVolume, "Production volume");

    next();
  } catch (err) {
    next(err);
  }
}