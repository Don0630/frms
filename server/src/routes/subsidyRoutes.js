// server/src/routes/subsidyRoutes.js
import express from "express";
import * as subsidyController from "../controllers/subsidyController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/subsidiesData", authenticateToken, subsidyController.getAllSubsidy); 
router.post("/addSubsidy", authenticateToken, subsidyController.saveSubsidy);
router.get("/subsidyData/:distributionID/farmers", authenticateToken, subsidyController.getAllFarmerPerSubsidy);
router.get("/availableFarmer", authenticateToken, subsidyController.getAvailableFarmer);
router.post("/addFarmerSubsidy", authenticateToken, subsidyController.saveFarmerSubsidy);
router.put("/updateDistributeSubsidy/:id", authenticateToken, subsidyController.updateDistributeSubsidy);

export default router;
