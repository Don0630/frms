// server/src/routes/userRoutes.js
import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();
 
router.post("/createUser", userController.createUser);

export default router;


