// server/src/routes/staffRoutes.js
import express from "express";
import { getAllStaff } from "../controllers/staffController.js";

const router = express.Router();
 
router.get("/staffsData", getAllStaff);

export default router;
