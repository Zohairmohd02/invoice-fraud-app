const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    // check existing
    const existsQ = await db.query('SELECT id FROM users WHERE username=$1 LIMIT 1', [username]);
    if (existsQ.rows && existsQ.rows.length) return res.status(409).json({ error: 'username already exists' });

    const hashed = bcrypt.hashSync(password, 8);
    // store user
    const result = await db.query(
      `INSERT INTO users(username, password_hash, created_at) VALUES($1,$2,datetime('now')) RETURNING *`,
      [username, hashed]
    );

    const user = result.rows && result.rows[0] ? result.rows[0] : { id: result.lastID, username };
    const token = jwt.sign({ sub: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: 'signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const q = await db.query('SELECT * FROM users WHERE username=$1 LIMIT 1', [username]);
    const u = q.rows && q.rows[0] ? q.rows[0] : null;
    if (!u) return res.status(401).json({ error: 'invalid credentials' });

    const ok = bcrypt.compareSync(password, u.password_hash || u.passwordHash || '');
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const token = jwt.sign({ sub: u.id, username: u.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: 'login failed' });
  }
});

module.exports = router;
