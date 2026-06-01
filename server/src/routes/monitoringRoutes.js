// server/src/routes/monitoringRoutes.js
import express from "express";
import * as monitoringController from "../controllers/monitoringController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateMonitoring from "../middleware/validateMonitoring.js";
import { authorizeRole } from "../middleware/authRoleMiddleware.js";

const router = express.Router();

router.get("/monitoringsData", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), monitoringController.getAllMonitoring);
router.post("/addMonitoring", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateMonitoring.validateAddMonitoring, monitoringController.saveMonitoring);
router.put("/updateMonitoring/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateMonitoring.validateEditMonitoring, monitoringController.updateMonitoring);
router.delete("/deleteMonitoring/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateMonitoring.validateDeleteMonitoring, monitoringController.deleteMonitoring);

export default router;
