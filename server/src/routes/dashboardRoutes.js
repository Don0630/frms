// server/src/routes/dashboardRoutes.js
import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authRoleMiddleware.js";

const router = express.Router();

router.get("/dashboardData", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), dashboardController.summary);

export default router;