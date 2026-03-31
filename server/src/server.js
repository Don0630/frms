// src/server.js
import app from "./app.js";
import dotenv from "dotenv";
import { db } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;


// ✅ Health check route
app.get("/_health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});