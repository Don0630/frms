// server/src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ✅ Use createPool for connection pooling
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,         // max connections
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // Railway requires this
  },
});

console.log("✅ MySQL pool created (Railway)");