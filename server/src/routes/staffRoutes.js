// server/src/routes/staffRoutes.js
import express from "express";
import * as staffController from "../controllers/staffController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateStaff from "../middleware/validateStaff.js"; 

const router = express.Router();


router.get("/staffsData", authenticateToken, staffController.getAllStaff);
router.post("/addStaff", authenticateToken, validateStaff.validateAddStaff, staffController.createStaff);
router.put("/updateStaff/:id", authenticateToken, validateStaff.validateEditStaff, staffController.updateStaff);
router.get("/availableStaff", authenticateToken, staffController.getAvailableStaff);
router.delete("/deleteStaff/:id", authenticateToken, validateStaff.validateDeleteStaff, staffController.deleteStaff);

export default router;
