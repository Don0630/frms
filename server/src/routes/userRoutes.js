// server/src/routes/userRoutes.js
import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateUser from "../middleware/validateUser.js";
import { authorizeRole } from "../middleware/authRoleMiddleware.js";

const router = express.Router();

router.get("/usersData", authenticateToken,authorizeRole("SuperAdmin", "Admin"), userController.getAllUser);
router.post("/createUser", authenticateToken,authorizeRole("SuperAdmin", "Admin"), validateUser.validateAddUser, userController.createUser);
router.put("/updateUser/:id", authenticateToken,authorizeRole("SuperAdmin", "Admin"), validateUser.validateEditUser, userController.updateUser);
router.delete("/deleteUser/:id", authenticateToken,authorizeRole("SuperAdmin", "Admin"), validateUser.validateDeleteUser, userController.deleteUser);

export default router;


