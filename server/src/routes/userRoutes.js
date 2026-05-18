// server/src/routes/userRoutes.js
import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateUser from "../middleware/validateUser.js";

const router = express.Router();

router.get("/usersData", authenticateToken, userController.getAllUser);
router.post("/createUser", authenticateToken, validateUser.validateAddUser, userController.createUser);
router.put("/updateUser/:id", authenticateToken, validateUser.validateEditUser, userController.updateUser);
router.delete("/deleteUser/:id", authenticateToken, validateUser.validateDeleteUser, userController.deleteUser);

export default router;


