// server/src/routes/userRoutes.js
import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/usersData", authenticateToken, userController.getAllUser);
router.post("/createUser", authenticateToken, userController.createUser);
router.put("/updateUser/:id", authenticateToken, userController.updateUser);
router.delete("/deleteUser/:id", authenticateToken, userController.deleteUser);

export default router;


