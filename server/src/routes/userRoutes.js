// server/src/routes/userRoutes.js
import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
 
router.post("/createUser", authenticateToken, userController.createUser);

export default router;


