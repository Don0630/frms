import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { db } from "./config/db.js";

const PORT = process.env.PORT || 5000;

/* -----------------------------
   🔐 Safety check
------------------------------ */
if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined in .env");
}

/* -----------------------------
   🚀 Start server (FIXED)
------------------------------ */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});