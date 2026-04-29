// server/src/routes/farmerRoutes.js
import express from "express";
import * as farmerController from "../controllers/farmerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/farmersData", authenticateToken, farmerController.getAllFarmer);
router.post("/addFarmer", authenticateToken, farmerController.saveFarmer);
router.put("/updateFarmer/:id", authenticateToken, farmerController.updateFarmer);

router.post("/addFarm", authenticateToken, farmerController.saveFarm);
router.put("/updateFarm/:id", authenticateToken, farmerController.updateFarm);
router.delete("/farm/:id", authenticateToken, farmerController.deleteFarm);

router.get("/searchFarmer", authenticateToken, farmerController.getSearchFarmer);
router.get("/farmerByID/:id", farmerController.getFarmerById);

export default router;
