// server/src/routes/livestockRoutes.js
import express from "express";
import * as livestockController from "../controllers/livestockController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateLivestock from "../middleware/validateLivestock.js";

const router = express.Router();


router.get("/livestocksData", authenticateToken, livestockController.getAllLivestock);
router.post("/addLivestock", authenticateToken, validateLivestock.validateAddLivestock, livestockController.saveLivestock);
router.put("/updateLivestock/:id", authenticateToken, validateLivestock.validateEditLivestock, livestockController.updateLivestock);
router.get("/searchLivestock", authenticateToken, livestockController.getSearchLivestock);

export default router;
