// server/src/validators/staffValidator.js
import * as validators from "../utils/validators.js";
import { throwError } from "../utils/throwError.js";

// ---------------------- ADD STAFF ----------------------
export function validateAddStaff(req, res, next) {
  try {
    validators.validateRequiredFields(
      req.body,
      ["FirstName", "MiddleName", "LastName", "Gender", "DateOfBirth", "Position", "Department", "ContactNumber", "Email"],
      {
        FirstName: "First name",
        MiddleName: "Middle name",
        LastName: "Last name",
        Gender: "Gender",
        DateOfBirth: "Date of birth",
        Position: "Position",
        Department: "Department",
        ContactNumber: "Contact number",
        Email: "Email",
      }
    );

    validators.validatePHMobileNumber(req.body.ContactNumber);
    validators.validateGender(req.body.Gender);
    validators.validatePHAge(req.body.DateOfBirth);
    validators.validateEmail(req.body.Email);

    next();
  } catch (err) {
    next(err);
  }
}


// ---------------------- EDIT STAFF ----------------------
export function validateEditStaff(req, res, next) {
  try {
    if (!req.params.id)
      throwError("Staff ID is required.", "MISSING_ID", 400);

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      throwError("Invalid Staff ID.", "INVALID_ID", 400);

    validators.validateRequiredFields(
      req.body,
      ["FirstName", "MiddleName", "LastName", "Gender", "DateOfBirth", "Position", "Department", "ContactNumber", "Email"],
      {
        FirstName: "First name",
        MiddleName: "Middle name",
        LastName: "Last name",
        Gender: "Gender",
        DateOfBirth: "Date of birth",
        Position: "Position",
        Department: "Department",
        ContactNumber: "Contact number",
        Email: "Email",
      }
    );

    validators.validatePHMobileNumber(req.body.ContactNumber);
    validators.validateGender(req.body.Gender);
    validators.validatePHAge(req.body.DateOfBirth);
    validators.validateEmail(req.body.Email);

    next();
  } catch (err) {
    next(err);
  }
}


// ---------------------- DELETE STAFF ----------------------
export function validateDeleteStaff(req, res, next) {
  try {
    if (!req.params.id)
      throwError("Staff ID is required.", "MISSING_ID", 400);

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      throwError("Invalid Staff ID.", "INVALID_ID", 400);

    next();
  } catch (err) {
    next(err);
  }
}


