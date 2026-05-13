// server/src/routes/subsidyRoutes.js
import express from "express";
import * as subsidyController from "../controllers/subsidyController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateSubsidy from "../middleware/validateSubsidy.js"; 

const router = express.Router();


router.get("/subsidiesData", authenticateToken, subsidyController.getAllSubsidy); 
router.post("/addSubsidy", authenticateToken, validateSubsidy.validateAddSubsidy, subsidyController.saveSubsidy); 
router.put("/updateSubsidy/:id", authenticateToken, validateSubsidy.validateEditSubsidy, subsidyController.updateSubsidy);

router.get("/availableFarmer", authenticateToken, subsidyController.getAvailableFarmer);
router.post("/addDistribution", authenticateToken, subsidyController.saveDistribution);
router.put("/updateDistribution/:id", authenticateToken, subsidyController.updateDistribution);
router.delete("/deleteDistribution/:id", authenticateToken, subsidyController.deleteDistribution);

// SUBSIDY DETAILS
router.get("/subsidyDetails/:id", authenticateToken, subsidyController.getSubsidyDetails);

export default router;
