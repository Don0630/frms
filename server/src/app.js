import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import subsidyRoutes from "./routes/subsidyRoutes.js";
import subsidyDetailsRoutes from "./routes/subsidyDetailsRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import livestockRoutes from "./routes/livestockRoutes.js";
import monitoringRoutes from "./routes/monitoringRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://frms-nine.vercel.app",
  "https://frms-git-main-iceys-projects-5e804d03.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server-to-server
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// 🔥 IMPORTANT: handle preflight requests
app.options("*", cors());

app.use(express.json());

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/staff", staffRoutes);
app.use("/program", programRoutes);
app.use("/subsidy", subsidyRoutes);
app.use("/subsidydetails", subsidyDetailsRoutes);
app.use("/farmer", farmerRoutes);
app.use("/crop", cropRoutes);
app.use("/livestock", livestockRoutes);
app.use("/monitoring", monitoringRoutes);

// --- Error handler ---
app.use(errorHandler);

export default app;