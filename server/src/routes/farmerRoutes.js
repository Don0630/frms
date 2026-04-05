// server/src/routes/farmerRoutes.js
import express from "express";
import * as farmerController from "../controllers/farmerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/farmersData", authenticateToken, farmerController.getAllFarmer);
router.post("/addFarmer", authenticateToken, farmerController.saveFarmer);

export default router;
