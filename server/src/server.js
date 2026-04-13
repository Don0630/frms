import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { db } from "./config/db.js"; // keep if it initializes DB connection

const PORT = process.env.PORT || 5000;

/* -----------------------------
   🔐 Safety check (important)
------------------------------ */
if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined in .env");
}

/* -----------------------------
   ❤️ Health Check (ONLY here or app.js — but NOT both)
   👉 Keeping ONLY in app.js, so remove duplicate if any
------------------------------ */

/* -----------------------------
   🚀 Start server
------------------------------ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});