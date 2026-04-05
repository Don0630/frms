// server/src/routes/livestockRoutes.js
import express from "express";
import * as livestockController from "../controllers/livestockController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/livestocksData", authenticateToken, livestockController.getAllLivestock);

export default router;
