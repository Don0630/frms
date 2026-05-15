// server/src/routes/monitoringRoutes.js
import express from "express";
import * as monitoringController from "../controllers/monitoringController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateMonitoring from "../middleware/validateMonitoring.js";

const router = express.Router();

router.get("/monitoringsData", authenticateToken, monitoringController.getAllMonitoring);
router.post("/addMonitoring", authenticateToken, validateMonitoring.validateAddMonitoring, monitoringController.saveMonitoring);
router.put("/updateMonitoring/:id", authenticateToken, validateMonitoring.validateEditMonitoring, monitoringController.updateMonitoring);

export default router;
