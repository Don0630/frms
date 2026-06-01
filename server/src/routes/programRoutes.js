// server/src/routes/programRoutes.js
import express from "express";
import * as programController from "../controllers/programController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateProgram from "../middleware/validateProgram.js";
import { authorizeRole } from "../middleware/authRoleMiddleware.js";

const router = express.Router();

router.get("/programsData", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"),  programController.getAllProgram);
router.post("/addProgram", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"),  validateProgram.validateAddProgram, programController.saveProgram);
router.put("/updateProgram/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"),  validateProgram.validateEditProgram, programController.updateProgram);
router.delete("/deleteProgram/:id", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"),  validateProgram.validateDeleteProgram, programController.deleteProgram);

router.get("/availableProgram", authenticateToken, authorizeRole("SuperAdmin", "Admin", "Staff"),  programController.getAvailableProgram);
 
export default router;
