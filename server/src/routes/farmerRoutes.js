// server/src/routes/farmerRoutes.js
import express from "express";
import * as farmerController from "../controllers/farmerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateFarmer from "../middleware/validateFarmer.js";
import { authorizeRole } from "../middleware/authRoleMiddleware.js";

const router = express.Router();


router.get("/farmersData", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), farmerController.getAllFarmer);
router.post("/addFarmer", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateFarmer.validateAddFarmer, farmerController.saveFarmer);
router.put("/updateFarmer/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateFarmer.validateEditFarmer, farmerController.updateFarmer);
router.delete("/deleteFarmer/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateFarmer.validateDeleteFarmer, farmerController.deleteFarmer);

router.get("/farmerById/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), farmerController.getFarmerById);
router.post("/addFarm", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateFarmer.validateAddFarm, farmerController.saveFarm);
router.put("/updateFarm/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateFarmer.validateEditFarm, farmerController.updateFarm);
router.delete("/farm/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateFarmer.validateDeleteFarm, farmerController.deleteFarm);

router.get("/searchFarmer", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), farmerController.getSearchFarmer);

export default router;
