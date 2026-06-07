// middleware/authorizeRole.js
import { errorResponse } from "../utils/response.js";

export function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, "Access denied.", "FORBIDDEN", null, 403);
    }
    next();
  };
}