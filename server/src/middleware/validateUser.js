// server/src/validators/validateUser.js
import * as validators from "../utils/validators.js";
import { throwError } from "../utils/throwError.js";

// ---------------------- CREATE USER ----------------------
export function validateAddUser(req, res, next) {
  try {
    validators.validateRequiredFields(
      req.body,
      ["staffId", "username", "password", "role"],
      {
        staffId: "Staff",
        username: "Username",
        password: "Password",
        role: "Role",
      }
    );

    const id = parseInt(req.body.staffId);
    if (isNaN(id) || id <= 0)
      throwError("Invalid Staff ID.", "INVALID_ID", 400);

    const usernameError = validators.validateUsername(req.body.username);
    if (usernameError) throwError(usernameError, "INVALID_INPUT", 400);

    const passwordError = validators.validatePassword(req.body.password, req.body.password);
    if (passwordError) throwError(passwordError, "INVALID_INPUT", 400);

    const roleError = validators.validateRole(req.body.role);
    if (roleError) throwError(roleError, "INVALID_INPUT", 400);

    next();
  } catch (err) {
    next(err);
  }
}


// ---------------------- EDIT USER ----------------------
export function validateEditUser(req, res, next) {
  try {
    if (!req.params.id)
      throwError("User ID is required.", "MISSING_ID", 400);

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      throwError("Invalid User ID.", "INVALID_ID", 400);

    validators.validateRequiredFields(
      req.body,
      ["username", "role"],
      {
        username: "Username",
        role: "Role",
      }
    );

    const usernameError = validators.validateUsername(req.body.username);
    if (usernameError) throwError(usernameError, "INVALID_INPUT", 400);

    const roleError = validators.validateRole(req.body.role);
    if (roleError) throwError(roleError, "INVALID_INPUT", 400);

    // password optional on edit — only validate if provided
    if (req.body.password) {
      const passwordError = validators.validatePassword(req.body.password, req.body.password);
      if (passwordError) throwError(passwordError, "INVALID_INPUT", 400);
    }

    next();
  } catch (err) {
    next(err);
  }
}


// ---------------------- DELETE USER ----------------------
export function validateDeleteUser(req, res, next) {
  try {
    if (!req.params.id)
      throwError("User ID is required.", "MISSING_ID", 400);

    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      throwError("Invalid User ID.", "INVALID_ID", 400);

    next();
  } catch (err) {
    next(err);
  }
}