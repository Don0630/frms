// server/src/routes/subsidyDetailsRoutes.js
import express from "express";
import * as subsidyDetailsController from "../controllers/subsidyDetailsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/subsidyDetailsData", authenticateToken, subsidyDetailsController.getAllSubsidyDetails);
router.get("/subsidyDetailsData/:distributionID/farmers", authenticateToken, subsidyDetailsController.getAllFarmerPerSubsidy);
router.get("/availableFarmer", authenticateToken, subsidyDetailsController.getAvailableFarmer);
router.post("/addFarmerSubsidy", authenticateToken, subsidyDetailsController.saveFarmerSubsidy);
router.put("/updateDistributeSubsidy/:id", authenticateToken, subsidyDetailsController.updateDistributeSubsidy);

export default router;
