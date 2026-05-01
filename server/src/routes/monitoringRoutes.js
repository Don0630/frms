// server/src/routes/monitoringRoutes.js
import express from "express";
import * as monitoringController from "../controllers/monitoringController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addMonitoring", authenticateToken, monitoringController.saveMonitoring);
router.get("/monitoringsData", authenticateToken, monitoringController.getAllMonitoring);
router.put("/updateMonitoring/:id", authenticateToken, monitoringController.updateMonitoring);

export default router;
