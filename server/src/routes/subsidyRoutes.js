// server/src/routes/subsidyRoutes.js
import express from "express";
import * as subsidyController from "../controllers/subsidyController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateSubsidy from "../middleware/validateSubsidy.js";
import { authorizeRole } from "../middleware/authRoleMiddleware.js";

const router = express.Router();


router.get("/subsidiesData", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), subsidyController.getAllSubsidy); 
router.post("/addSubsidy", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateSubsidy.validateAddSubsidy, subsidyController.saveSubsidy); 
router.put("/updateSubsidy/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateSubsidy.validateEditSubsidy, subsidyController.updateSubsidy);
router.delete("/deleteSubsidy/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateSubsidy.validateDeleteSubsidy, subsidyController.deleteSubsidy);

router.get("/availableFarmer", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), subsidyController.getAvailableFarmer);
router.post("/addDistribution", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), subsidyController.saveDistribution);
router.put("/updateDistribution/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), subsidyController.updateDistribution);
router.delete("/deleteDistribution/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), subsidyController.deleteDistribution);

// SUBSIDY DETAILS
router.get("/subsidyDetails/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), subsidyController.getSubsidyDetails);

export default router;
