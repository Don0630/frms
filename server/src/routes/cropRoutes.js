// server/src/routes/cropRoutes.js
import express from "express";
import * as cropController from "../controllers/cropController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateCrop from "../middleware/validateCrop.js";
const router = express.Router();


router.get("/cropsData", authenticateToken, cropController.getAllCrop);
router.post("/addCrop", authenticateToken, validateCrop.validateAddCrop, cropController.saveCrop);
router.put("/updateCrop/:id", authenticateToken, validateCrop.validateEditCrop, cropController.updateCrop);
router.delete("/deleteCrop/:id", authenticateToken, validateCrop.validateDeleteCrop, cropController.deleteCrop);
router.get("/searchCrop", authenticateToken, cropController.getSearchCrop);


export default router;

 