import express from "express";
import * as authController from "../controllers/authController.js";
import { validateLogin } from "../middleware/validateLogin.js";

const router = express.Router();

// POST /auth/login
router.post("/login", validateLogin, authController.login);

// POST /auth/logout
router.post("/logout", authController.logout);

export default router;