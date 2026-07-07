const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nationiq_secret_key';

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user's watchlist
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, c.iso_code, c.flag_url, c.region, c.capital, 
              c.currency_code, c.currency_name, w.created_at
       FROM watchlist w
       JOIN countries c ON w.country_id = c.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add country to watchlist
router.post('/:iso_code', authenticate, async (req, res) => {
  try {
    const { iso_code } = req.params;

    const countryRes = await pool.query(
      'SELECT id FROM countries WHERE iso_code = $1',
      [iso_code.toUpperCase()]
    );

    if (countryRes.rows.length === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }

    const country_id = countryRes.rows[0].id;

    await pool.query(
      `INSERT INTO watchlist (user_id, country_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, country_id) DO NOTHING`,
      [req.user.id, country_id]
    );

    res.json({ message: 'Added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove country from watchlist
router.delete('/:iso_code', authenticate, async (req, res) => {
  try {
    const { iso_code } = req.params;

    const countryRes = await pool.query(
      'SELECT id FROM countries WHERE iso_code = $1',
      [iso_code.toUpperCase()]
    );

    if (countryRes.rows.length === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }

    const country_id = countryRes.rows[0].id;

    await pool.query(
      'DELETE FROM watchlist WHERE user_id = $1 AND country_id = $2',
      [req.user.id, country_id]
    );

    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if country is in watchlist
router.get('/check/:iso_code', authenticate, async (req, res) => {
  try {
    const { iso_code } = req.params;

    const countryRes = await pool.query(
      'SELECT id FROM countries WHERE iso_code = $1',
      [iso_code.toUpperCase()]
    );

    if (countryRes.rows.length === 0) {
      return res.json({ inWatchlist: false });
    }

    const country_id = countryRes.rows[0].id;

    const result = await pool.query(
      'SELECT id FROM watchlist WHERE user_id = $1 AND country_id = $2',
      [req.user.id, country_id]
    );

    res.json({ inWatchlist: result.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;