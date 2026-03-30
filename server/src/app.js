// src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";


const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Vite dev server
  credentials: true,               // allow cookies & auth headers
}));
 
app.use(express.json());


// --- Routes ---
app.use("/auth", authRoutes); 

// --- Error handler ---
app.use(errorHandler);


export default app;



