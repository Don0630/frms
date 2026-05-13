// server/src/routes/farmerRoutes.js
import express from "express";
import * as farmerController from "../controllers/farmerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as validateFarmer from "../middleware/validateFarmer.js"; 

const router = express.Router();


router.get("/farmersData", authenticateToken, farmerController.getAllFarmer);
router.post("/addFarmer", authenticateToken, validateFarmer.validateAddFarmer, farmerController.saveFarmer);
router.put("/updateFarmer/:id", authenticateToken, validateFarmer.validateEditFarmer, farmerController.updateFarmer);

router.post("/addFarm", authenticateToken, validateFarmer.validateAddFarm, farmerController.saveFarm);
router.put("/updateFarm/:id", authenticateToken, validateFarmer.validateEditFarm, farmerController.updateFarm);
router.delete("/farm/:id", authenticateToken, validateFarmer.validateDeleteFarm, farmerController.deleteFarm);

router.get("/searchFarmer", authenticateToken, farmerController.getSearchFarmer);
router.get("/farmerById/:id", authenticateToken, farmerController.getFarmerById);

export default router;
