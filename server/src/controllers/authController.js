// server/src/controllers/authController.js
import { loginUser } from "../services/authService.js";
import { validateLoginInput } from "../utils/validators.js";
import { successResponse, errorResponse } from "../utils/response.js";


// LOGIN
export async function login(req, res, next) {
  const { identifier, password } = req.body;

  // Validate input
  const error = validateLoginInput({ identifier, password });
  if (error) return errorResponse(res, error, 400);

  try {
    const { userSafe, accessToken, refreshToken } = await loginUser({
      identifier,
      password,
    });

    // Set refresh token as HTTP-only cookie
 res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    // Send user info + access token
    return successResponse(res, "Login successful", {
      user: userSafe,
      token: accessToken,
    });
  } catch (err) {
    return next(err);
  }
}




// LOGOUT
export async function logout(req, res) {
  // Clear refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return successResponse(res, "Logged out successfully");
}