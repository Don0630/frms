// server/src/routes/livestockRoutes.js
import express from "express";
import * as livestockController from "../controllers/livestockController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateLivestock from "../middleware/validateLivestock.js";
import { authorizeRole } from "../middleware/authRoleMiddleware.js";

const router = express.Router();


router.get("/livestocksData", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), livestockController.getAllLivestock);
router.post("/addLivestock", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateLivestock.validateAddLivestock, livestockController.saveLivestock);
router.put("/updateLivestock/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateLivestock.validateEditLivestock, livestockController.updateLivestock);
router.delete("/deleteLivestock/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateLivestock.validateDeleteLivestock, livestockController.deleteLivestock);
router.get("/searchLivestock", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), livestockController.getSearchLivestock);

export default router;
