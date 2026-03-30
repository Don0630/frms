// server/src/models/authModel.js
import { db } from "../config/db.js";

// --------- CREATE ACCOUNT ---------
export async function createAccount({ username, email, password }) {
  const query = `
    INSERT INTO accounts (username, email, password)
    VALUES (?, ?, ?)
  `;
  const values = [username, email, password];

  const [result] = await db.query(query, values);

  // MySQL doesn't support RETURNING, so fetch manually
  return {
    id: result.insertId,
    username,
    email,
  };
}

// --------- FIND BY EMAIL ---------
export async function findByEmail(email) {
  const query = `SELECT * FROM accounts WHERE email = ? LIMIT 1`;
  const [rows] = await db.query(query, [email]);
  return rows[0] || null;
}

// --------- FIND BY USERNAME ---------
export async function findByUsername(username) {
  const query = `SELECT * FROM accounts WHERE username = ? LIMIT 1`;
  const [rows] = await db.query(query, [username]);
  return rows[0] || null;
}

// --------- FIND BY ID ---------
export async function findById(id) {
  const query = `SELECT id, username, email FROM accounts WHERE id = ? LIMIT 1`;
  const [rows] = await db.query(query, [id]);
  return rows[0] || null;
}

// --------- FIND BY USERNAME OR EMAIL ---------
export async function findByUsernameOrEmail(identifier) {
  const query = `
    SELECT * FROM accounts 
    WHERE username = ? OR email = ?
    LIMIT 1
  `;
  const [rows] = await db.query(query, [identifier, identifier]);
  return rows[0] || null;
}