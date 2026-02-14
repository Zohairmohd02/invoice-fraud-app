const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Try Postgres first, otherwise fallback to sqlite3 local file
// Default to sqlite when no DB_HOST is configured to avoid async connection errors
const useSqlite = process.env.FORCE_SQLITE === '1' || !process.env.DB_HOST;

if (!useSqlite) {
  try {
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'invoice_user',
      password: process.env.DB_PASSWORD || 'invoice_pass',
      database: process.env.DB_NAME || 'invoices_db',
      port: 5432,
    });

    module.exports = {
      query: (text, params) => pool.query(text, params),
      clientType: 'pg'
    };
    console.log('DB: using Postgres client');
    return;
  } catch (err) {
    console.warn('Postgres not available, falling back to sqlite', err.message || err);
  }
}

// SQLite fallback
const sqlite3 = require('sqlite3').verbose();
const dbFile = path.join(__dirname, '..', 'data.sqlite');
const exists = fs.existsSync(dbFile);
const sqlite = new sqlite3.Database(dbFile);

// ensure invoices table exists
sqlite.serialize(() => {
  sqlite.run(`CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor TEXT,
    amount REAL,
    invoice_date TEXT,
    metadata TEXT,
    risk_score REAL,
    flagged INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  sqlite.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  // feedback table to track user corrections for false positives/negatives
  sqlite.run(`CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    false_positive INTEGER DEFAULT 0,
    comment TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
});

function runAsync(sql, params=[]) {
  return new Promise((resolve, reject) => {
    sqlite.run(sql, params, function(err) {
      if (err) return reject(err);
      // return lastID and changes
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function allAsync(sql, params=[]) {
  return new Promise((resolve, reject) => {
    sqlite.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve({ rows });
    });
  });
}

module.exports = {
  query: async (text, params=[]) => {
    const t = text.trim().toUpperCase();
    if (t.startsWith('INSERT') && !t.includes('RETURNING')) {
      const res = await runAsync(text, params);
      return { rows: [{ id: res.lastID }], rowCount: res.changes };
    }
    const res = await allAsync(text, params);
    return { rows: res.rows };
  },
  clientType: 'sqlite'
};
