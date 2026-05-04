import * as validators from "../utils/validators.js"; 
import { errorResponse } from "../utils/response.js";

export function validateLogin(req, res, next) {
  try {
    // check required fields
    validators.validateRequiredFields(req.body, ["identifier", "password"]);
     
    next(); // continue to controller
  } catch (err) {
    return next(err);
  }
}