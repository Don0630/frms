// src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";


const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Vite dev server
  credentials: true,               // allow cookies & auth headers
}));
 
app.use(express.json());


// --- Routes ---
app.use("/auth", authRoutes); 
app.use("/user", userRoutes);
app.use("/staff", staffRoutes);
app.use("/farmer", farmerRoutes);

// --- Error handler ---
app.use(errorHandler);


export default app;



