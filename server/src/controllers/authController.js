// server/src/controllers/authController.js
import { loginUser } from "../services/authService.js";
import { validateRegisterInput, validateLoginInput } from "../utils/validators.js";
import { successResponse, errorResponse } from "../utils/response.js";


export async function login(req, res, next) {
  const { identifier, password } = req.body;
  const error = validateLoginInput({ identifier, password });
  if (error) return errorResponse(res, error, 400);

  try {
    const { userSafe, accessToken, refreshToken } = await loginUser({
      identifier,
      password,
    });

    // set refresh token as HTTP-only cookie
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in prod
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


    // ✅ Send only immutable IDs in user
    // ✅ Send locationId separately since it's mutable
    return successResponse(res, "Login successful", {
      user: userSafe,  
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
} 