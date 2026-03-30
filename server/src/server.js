// src/server.js
import app from "./app.js";
import dotenv from "dotenv";
import { db } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});