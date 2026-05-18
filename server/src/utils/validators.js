import { throwError } from "./throwError.js";


// =============================== REQUIRED FIELDS VALIDATOR ===============================
export function validateRequiredFields(data, fields, labels = {}) {
  for (const field of fields) {
    const value = data?.[field];
    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "");
    if (isEmpty) {
      throwError(`${labels[field] || field} is required.`, "REQUIRED_FIELD_MISSING", 400);
    }
  }
}

// =============================== MATCH FIELD VALIDATOR ===============================
export function validateFieldsMatch(data, field1, field2, labels = {}) {
  if (data[field1] !== data[field2]) {
    const label1 = labels[field1] || field1;
    const label2 = labels[field2] || field2;
    throwError(`${label1} and ${label2} do not match`, "FIELDS_DO_NOT_MATCH", 400);
  }
}

// =============================== PH PHONE NUMBER VALIDATOR ===============================
export function validatePHMobileNumber(number) {
  const cleaned = number.trim();
  if (!/^09/.test(cleaned)) throwError("Contact number must start with 09!", "INVALID_PHONE", 400);
  if (!/^\d+$/.test(cleaned)) throwError("Contact number must contain numbers only!", "INVALID_PHONE", 400);
  if (cleaned.length !== 11) throwError("Contact number must be exactly 11 digits!", "INVALID_PHONE", 400);
}

// =============================== EMAIL VALIDATOR ===============================
export function validateEmail(email) {
  if (!email) throwError("Email is required", "INVALID_EMAIL", 400);
  const cleaned = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) throwError("Invalid email format!", "INVALID_EMAIL", 400);
}

// =============================== DATE OF BIRTH VALIDATOR ===============================
export function validatePHAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  if (age < 18) throwError("Farmer must be at least 18 years old!", "INVALID_AGE", 400);
  if (age > 100) throwError("Age cannot exceed 100 years!", "INVALID_AGE", 400);
}

// =============================== GENDER FIELD VALIDATOR ===============================
export function validateGender(gender) {
  const allowedGenders = ["Male", "Female", "Other"];
  if (!allowedGenders.includes(gender)) throwError("Invalid gender selected", "INVALID_GENDER", 400);
}

// =============================== NUMBER VALIDATOR ===============================
export function validatePositiveNumber(value, fieldName = "Field") {
  if (value === null || value === undefined || value === "") throwError(`${fieldName} is required.`, "REQUIRED_FIELD_MISSING", 400);
  const num = Number(value);
  if (isNaN(num)) throwError(`${fieldName} must be a valid number.`, "INVALID_NUMBER", 400);
  if (num <= 0) throwError(`${fieldName} must be greater than 0.`, "INVALID_NUMBER", 400);
}


// =============================== ID VALIDATOR VALIDATOR ===============================
export function validateID(value, fieldName = "ID") {
  if (value === null || value === undefined || value === "") {
    throwError(`${fieldName} is required.`, "MISSING_ID", 400);
  }
  const id = parseInt(value);
  if (isNaN(id) || id <= 0) {
    throwError(`Invalid ${fieldName}`, "INVALID_ID", 400);
  }
}


// =============================== USERNAME VALIDATOR ===============================
export function validateUsername(username, fieldName = "Username") {
  if (!username?.trim())
    throwError(`${fieldName} is required.`, "REQUIRED_FIELD_MISSING", 400);

  const value = username.trim();

  if (value.length < 5)
    throwError(`${fieldName} must be at least 5 characters long.`, "INVALID_USERNAME", 400);

  if (!/^[a-zA-Z0-9_]+$/.test(value))
    throwError(`${fieldName} can only contain letters, numbers, and underscores.`, "INVALID_USERNAME", 400);
}


// =============================== PASSWORD VALIDATOR ===============================
export function validatePassword(password, fieldName = "Password") {
  if (!password?.trim())
    throwError(`${fieldName} is required.`, "REQUIRED_FIELD_MISSING", 400);

  const value = password.trim();

  if (value.length < 8)
    throwError(`${fieldName} must be at least 8 characters long.`, "INVALID_PASSWORD", 400);

  if (!/[A-Z]/.test(value))
    throwError(`${fieldName} must contain at least one uppercase letter.`, "INVALID_PASSWORD", 400);

  if (!/[a-z]/.test(value))
    throwError(`${fieldName} must contain at least one lowercase letter.`, "INVALID_PASSWORD", 400);

  if (!/[0-9]/.test(value))
    throwError(`${fieldName} must contain at least one number.`, "INVALID_PASSWORD", 400);

  if (!/[^a-zA-Z0-9]/.test(value))
    throwError(`${fieldName} must contain at least one special character.`, "INVALID_PASSWORD", 400);
}


// =============================== ROLE VALIDATOR ===============================
export function validateRole(role) {
  const allowedRoles = ["Admin", "Staff"];
  if (!allowedRoles.includes(role))
    throwError("Invalid role selected.", "INVALID_ROLE", 400);
}