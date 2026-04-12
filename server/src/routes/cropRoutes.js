// server/src/routes/cropRoutes.js
import express from "express";
import * as cropController from "../controllers/cropController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/cropsData", authenticateToken, cropController.getAllCrop);
router.post("/addCrop", authenticateToken, cropController.saveCrop);
router.get("/searchCrops", authenticateToken, cropController.getSearchCrops);


export default router;
