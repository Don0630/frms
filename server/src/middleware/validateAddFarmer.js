import * as validators from "../utils/validators.js";  

export function validateAddFarmer(req, res, next) {
  try {
    // check required fields
  validators.validateRequiredFields(req.body, [
  "FirstName",
  "MiddleName",
  "LastName",
  "Gender",
  "DateOfBirth",
  "Barangay",
  "Municipality",
  "Province",
  "ContactNumber",
  "Email"
]);
     
    next(); // continue to controller
  } catch (err) {
    next(err);
  }
}



