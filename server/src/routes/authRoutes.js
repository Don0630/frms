// authRoutes.js
import express from "express";
import * as authController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateLogin } from "../middleware/validateLogin.js";

const router = express.Router();

router.post("/login", validateLogin, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authenticateToken, authController.me);

export default router;