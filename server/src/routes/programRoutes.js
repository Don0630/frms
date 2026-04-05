// server/src/routes/programRoutes.js
import express from "express";
import * as programController from "../controllers/programController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/programsData", authenticateToken, programController.getAllProgram);
 
export default router;
