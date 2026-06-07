import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import subsidyRoutes from "./routes/subsidyRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import livestockRoutes from "./routes/livestockRoutes.js";
import monitoringRoutes from "./routes/monitoringRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

/* -----------------------------
   🛡️ HELMET
------------------------------ */
app.use(helmet());

/* -----------------------------
   🌐 CORS
------------------------------ */
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) || [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

/* -----------------------------
   🚦 RATE LIMITING
------------------------------ */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later.", code: "RATE_LIMITED", data: null },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts, please try again later.", code: "RATE_LIMITED", data: null },
});

app.use("/api", apiLimiter);
app.use("/auth", authLimiter);

/* -----------------------------
   📦 MIDDLEWARE
------------------------------ */
app.use(express.json());
app.use(cookieParser());

/* -----------------------------
   🚀 ROUTES
------------------------------ */
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/staff", staffRoutes);
app.use("/program", programRoutes);
app.use("/subsidy", subsidyRoutes);
app.use("/farmer", farmerRoutes);
app.use("/crop", cropRoutes);
app.use("/livestock", livestockRoutes);
app.use("/monitoring", monitoringRoutes);

/* -----------------------------
   ❌ ERROR HANDLER (LAST)
------------------------------ */
app.use(errorHandler);

export default app;