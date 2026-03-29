// src/app.js
import express from "express";
import cors from "cors";
import { db } from "./config/db.js";

const app = express();

app.use(cors()); // allow frontend to access API
app.use(express.json());

// =====================
// Example API routes
// =====================

// Get all monitoring records
app.get("/api/monitoring", (req, res) => {
  const sql = "SELECT * FROM monitoring";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all subsidy records
app.get("/api/subsidy", (req, res) => {
  const sql = "SELECT * FROM subsidy";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// You can add similar routes for staff, crops, livestock
// e.g., /api/staff, /api/crops, /api/livestock

export default app;