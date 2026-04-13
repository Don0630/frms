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

/* -----------------------------
   🌐 Allowed Origins
------------------------------ */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://frms-nine.vercel.app",
  "https://frms-git-main-iceys-projects-5e804d03.vercel.app"
];

/* -----------------------------
   ✅ CORS CONFIG
------------------------------ */
const corsOptions = {
  origin: (origin, callback) => {
    // allow REST tools / server-to-server requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};

app.use(cors(corsOptions));

 
/* -----------------------------
   📦 Middleware
------------------------------ */
app.use(express.json());

/* -----------------------------
   ❤️ Health Check
------------------------------ */
app.get("/_health", (req, res) => {
  res.json({ ok: true });
});

/* -----------------------------
   🚀 Routes
------------------------------ */
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

/* -----------------------------
   ❌ Error Handler (must be last)
------------------------------ */
app.use(errorHandler);

export default app;