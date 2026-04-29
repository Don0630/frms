// server/src/routes/subsidyRoutes.js
import express from "express";
import * as subsidyController from "../controllers/subsidyController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/subsidiesData", authenticateToken, subsidyController.getAllSubsidy); 
router.post("/addSubsidy", authenticateToken, subsidyController.saveSubsidy); 
router.get("/availableFarmer", authenticateToken, subsidyController.getAvailableFarmer);
router.post("/addDistribution", authenticateToken, subsidyController.saveDistribution);
router.put("/updateDistribution/:id", authenticateToken, subsidyController.updateDistribution);
router.delete("/deleteDistribution/:id", authenticateToken, subsidyController.deleteDistribution);
router.get("/subsidyByID/:id", authenticateToken, subsidyController.getSubsidyById);

export default router;
