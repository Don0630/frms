import * as validators from "../utils/validators.js";


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
