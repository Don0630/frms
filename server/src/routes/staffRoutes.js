// server/src/routes/staffRoutes.js
import express from "express";
import * as staffController from "../controllers/staffController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateStaff from "../middleware/validateStaff.js";
import { authorizeRole } from "../middleware/authRoleMiddleware.js";

const router = express.Router();


router.get("/staffsData", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), staffController.getAllStaff);
router.post("/addStaff", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateStaff.validateAddStaff, staffController.createStaff);
router.put("/updateStaff/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateStaff.validateEditStaff, staffController.updateStaff);
router.get("/availableStaff", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), staffController.getAvailableStaff);
router.delete("/deleteStaff/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateStaff.validateDeleteStaff, staffController.deleteStaff);

export default router;
