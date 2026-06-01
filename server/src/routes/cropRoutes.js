// server/src/routes/cropRoutes.js
import express from "express";
import * as cropController from "../controllers/cropController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateCrop from "../middleware/validateCrop.js";
import { authorizeRole } from "../middleware/authRoleMiddleware.js";

const router = express.Router();


router.get("/cropsData", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), cropController.getAllCrop);
router.post("/addCrop", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateCrop.validateAddCrop, cropController.saveCrop);
router.put("/updateCrop/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateCrop.validateEditCrop, cropController.updateCrop);
router.delete("/deleteCrop/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), validateCrop.validateDeleteCrop, cropController.deleteCrop);
router.get("/searchCrop", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"), cropController.getSearchCrop);


export default router;

 