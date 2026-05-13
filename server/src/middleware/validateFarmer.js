import * as validators from "../utils/validators.js";
import { throwError } from "../utils/throwError.js";

// ---------------------- ADD ----------------------
export function validateAddFarmer(req, res, next) {
  try {
    // required fields
    validators.validateRequiredFields(req.body,
      ["FirstName", "LastName", "Gender", "DateOfBirth", "Barangay", "Municipality", "Province", "ContactNumber", "Email"],
      {
        FirstName: "First name",
        LastName: "Last name",
        Gender: "Gender",
        DateOfBirth: "Date of birth",
        Barangay: "Barangay",
        Municipality: "Municipality",
        Province: "Province",
        ContactNumber: "Contact number",
        Email: "Email",
      }
    );

    // format validations
    validators.validatePHMobileNumber(req.body.ContactNumber);
    validators.validateGender(req.body.Gender);
    validators.validatePHAge(req.body.DateOfBirth);
    validators.validateEmail(req.body.Email);

    next();
  } catch (err) {
    next(err);
  }
}


// ---------------------- EDIT ----------------------
export function validateEditFarmer(req, res, next) {
  try {
    // required fields
    validators.validateRequiredFields(req.body,
      ["FirstName", "LastName", "Gender", "DateOfBirth", "Barangay", "Municipality", "Province", "ContactNumber", "Email"],
      {
        FirstName: "First name",
        LastName: "Last name",
        Gender: "Gender",
        DateOfBirth: "Date of birth",
        Barangay: "Barangay",
        Municipality: "Municipality",
        Province: "Province",
        ContactNumber: "Contact number",
        Email: "Email",
      }
    );

    // format validations
    validators.validatePHMobileNumber(req.body.ContactNumber);
    validators.validateGender(req.body.Gender);
    validators.validatePHAge(req.body.DateOfBirth);
    validators.validateEmail(req.body.Email);

    next();
  } catch (err) {
    next(err);
  }
}




// ---------------------- ADD FARM ----------------------
export function validateAddFarm(req, res, next) {
  try {
    validators.validateRequiredFields(req.body,
      ["FarmerID", "FarmBarangay", "FarmMunicipality", "FarmProvince", "FarmSize"],
      {
        FarmerID: "Farmer ID",
        FarmBarangay: "Barangay",
        FarmMunicipality: "Municipality",
        FarmProvince: "Province",
        FarmSize: "Farm size",
      }
    );

    validators.validatePositiveNumber(req.body.FarmSize, "Farm size");

    next();
  } catch (err) {
    next(err);
  }
}




// ---------------------- EDIT FARM ----------------------
export function validateEditFarm(req, res, next) {
  try {
    // validate params
    if (!req.params.id) {
      throwError("Farm ID is required", "MISSING_ID", 400);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      throwError("Invalid Farm ID", "INVALID_ID", 400);
    }

    // required fields
    validators.validateRequiredFields(req.body,
      ["FarmBarangay", "FarmMunicipality", "FarmProvince", "FarmSize"],
      {
        FarmBarangay: "Barangay",
        FarmMunicipality: "Municipality",
        FarmProvince: "Province",
        FarmSize: "Farm size",
      }
    );

    // format validations
    validators.validatePositiveNumber(req.body.FarmSize, "Farm size");

    next();
  } catch (err) {
    next(err);
  }
}




// ---------------------- DELETE FARM ----------------------
export function validateDeleteFarm(req, res, next) {
  try {
    if (!req.params.id) {
      throwError("Farm ID is required", "MISSING_ID", 400);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      throwError("Invalid Farm ID", "INVALID_ID", 400);
    }

    next();
  } catch (err) {
    next(err);
  }
}