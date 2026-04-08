// server/src/routes/subsidyRoutes.js
import express from "express";
import * as subsidyController from "../controllers/subsidyController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/subsidiesData", authenticateToken, subsidyController.getAllSubsidy); 
router.post("/addSubsidy", authenticateToken, subsidyController.saveSubsidy);

export default router;
