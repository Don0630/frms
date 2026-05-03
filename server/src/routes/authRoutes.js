// server/src/routes/authRoutes.js
import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();
 
// POST /auth/login
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
