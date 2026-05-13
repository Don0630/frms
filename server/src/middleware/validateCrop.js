import { throwError } from "../utils/throwError.js";
import * as validators from "../utils/validators.js";

const ALLOWED_CATEGORIES = ["Grain", "Vegetable", "Fruit", "Root Crop", "Legume"];
const ALLOWED_SEASONS = ["Wet", "Dry", "All Year"];

// ---------------------- ADD CROP ----------------------
export function validateAddCrop(req, res, next) {
  try {
    validators.validateRequiredFields(req.body,
      ["CropName", "Category", "Season", "AverageYieldPerHectare", "MarketPrice"],
      {
        CropName: "Crop name",
        Category: "Category",
        Season: "Season",
        AverageYieldPerHectare: "Average yield per hectare",
        MarketPrice: "Market price",
      }
    );

    if (!ALLOWED_CATEGORIES.includes(req.body.Category)) {
      throwError("Invalid category selected", "INVALID_CATEGORY", 400);
    }

    if (!ALLOWED_SEASONS.includes(req.body.Season)) {
      throwError("Invalid season selected", "INVALID_SEASON", 400);
    }

    validators.validatePositiveNumber(req.body.AverageYieldPerHectare, "Average yield per hectare");
    validators.validatePositiveNumber(req.body.MarketPrice, "Market price");

    next();
  } catch (err) {
    next(err);
  }
}

// ---------------------- EDIT CROP ----------------------
export function validateEditCrop(req, res, next) {
  try {
    if (!req.params.id) {
      throwError("Crop ID is required", "MISSING_ID", 400);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      throwError("Invalid Crop ID", "INVALID_ID", 400);
    }

    validators.validateRequiredFields(req.body,
      ["CropName", "Category", "Season", "AverageYieldPerHectare", "MarketPrice"],
      {
        CropName: "Crop name",
        Category: "Category",
        Season: "Season",
        AverageYieldPerHectare: "Average yield per hectare",
        MarketPrice: "Market price",
      }
    );

    if (!ALLOWED_CATEGORIES.includes(req.body.Category)) {
      throwError("Invalid category selected", "INVALID_CATEGORY", 400);
    }

    if (!ALLOWED_SEASONS.includes(req.body.Season)) {
      throwError("Invalid season selected", "INVALID_SEASON", 400);
    }

    validators.validatePositiveNumber(req.body.AverageYieldPerHectare, "Average yield per hectare");
    validators.validatePositiveNumber(req.body.MarketPrice, "Market price");

    next();
  } catch (err) {
    next(err);
  }
}