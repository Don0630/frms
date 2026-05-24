import { throwError } from "../utils/throwError.js";
import * as validators from "../utils/validators.js";

const ALLOWED_TYPES = ["Cattle", "Poultry", "Swine", "Goat"];

// ---------------------- ADD LIVESTOCK ----------------------
export function validateAddLivestock(req, res, next) {
  try {
    validators.validateRequiredFields(req.body,
      ["Type", "Breed", "AverageProduction", "MarketPrice"],
      {
        Type: "Livestock type",
        Breed: "Breed",
        AverageProduction: "Average production",
        MarketPrice: "Market price",
      }
    );

    if (!ALLOWED_TYPES.includes(req.body.Type)) {
      throwError("Invalid livestock type selected", "INVALID_TYPE", 400);
    }

    validators.validatePositiveNumber(req.body.AverageProduction, "Average production");
    validators.validatePositiveNumber(req.body.MarketPrice, "Market price");

    next();
  } catch (err) {
    next(err);
  }
}

// ---------------------- EDIT LIVESTOCK ----------------------
export function validateEditLivestock(req, res, next) {
  try {
    if (!req.params.id) {
      throwError("Livestock ID is required", "MISSING_ID", 400);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      throwError("Invalid Livestock ID", "INVALID_ID", 400);
    }

    validators.validateRequiredFields(req.body,
      ["Type", "Breed", "AverageProduction", "MarketPrice"],
      {
        Type: "Livestock type",
        Breed: "Breed",
        AverageProduction: "Average production",
        MarketPrice: "Market price",
      }
    );

    if (!ALLOWED_TYPES.includes(req.body.Type)) {
      throwError("Invalid livestock type selected", "INVALID_TYPE", 400);
    }

    validators.validatePositiveNumber(req.body.AverageProduction, "Average production");
    validators.validatePositiveNumber(req.body.MarketPrice, "Market price");

    next();
  } catch (err) {
    next(err);
  }
}



// ---------------------- DELETE LIVESTOCK ----------------------
export function validateDeleteLivestock(req, res, next) {
  try {
    if (!req.params.id) {
      throwError("Livestock ID is required", "MISSING_ID", 400);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      throwError("Invalid Livestock ID", "INVALID_ID", 400);
    }

    next();
  } catch (err) {
    next(err);
  }
}