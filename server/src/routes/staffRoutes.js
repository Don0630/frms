// server/src/routes/staffRoutes.js
import express from "express";
import * as staffController from "../controllers/staffController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
 
router.get("/staffsData", authenticateToken, staffController.getAllStaff);

export default router;
