// server/src/routes/subsidyDetailsRoutes.js
import express from "express";
import * as subsidyDetailsController from "../controllers/subsidyDetailsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/subsidyDetailsData", authenticateToken, subsidyDetailsController.getAllSubsidyDetails);
router.get("/subsidyDetailsData/:distributionID/farmers", authenticateToken, subsidyDetailsController.getAllFarmerPerSubsidy);

export default router;
