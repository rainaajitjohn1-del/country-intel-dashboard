const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all latest exchange rates
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (currency_code) currency_code, rate_to_usd, date
       FROM exchange_rates
       ORDER BY currency_code, date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get exchange rate for a specific currency
router.get('/:currency_code', async (req, res) => {
  try {
    const { currency_code } = req.params;
    const result = await pool.query(
      `SELECT * FROM exchange_rates
       WHERE currency_code = $1
       ORDER BY date DESC
       LIMIT 1`,
      [currency_code.toUpperCase()]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Compare two currencies
router.get('/compare/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    const result = await pool.query(
      `SELECT currency_code, rate_to_usd FROM exchange_rates
       WHERE currency_code = ANY($1)
       ORDER BY currency_code, date DESC`,
      [[from.toUpperCase(), to.toUpperCase()]]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;