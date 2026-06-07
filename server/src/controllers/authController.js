// server/src/controllers/authController.js
import { loginUser, refreshAccessToken, getUser } from "../services/authService.js";
import { successResponse } from "../utils/response.js";

// LOGIN
export async function login(req, res, next) {
  const { identifier, password } = req.body;

  try {
    const { userSafe, accessToken, refreshToken } = await loginUser({
      identifier,
      password,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return successResponse(res, "Login successful", { user: userSafe });
  } catch (err) {
    return next(err);
  }
}


// REFRESH
export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken } = await refreshAccessToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return successResponse(res, "Token refreshed.");
  } catch (err) {
    return next(err);
  }
}


// LOGOUT
export async function logout(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return successResponse(res, "Logged out successfully");
}




export async function user(req, res, next) {
  try {
    const user = await getUser(req.user.id);
    return successResponse(res, "Authenticated", { user });
  } catch (err) {
    return next(err);
  }
}