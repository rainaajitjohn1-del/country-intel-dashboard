const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all countries
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, iso_code, region, capital, flag_url, currency_code, currency_name FROM countries ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search countries by name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const result = await pool.query(
      'SELECT id, name, iso_code, region, capital, flag_url, currency_code, currency_name FROM countries WHERE name ILIKE $1 ORDER BY name',
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single country by iso_code
router.get('/:iso_code', async (req, res) => {
  try {
    const { iso_code } = req.params;
    const result = await pool.query(
      'SELECT * FROM countries WHERE iso_code = $1',
      [iso_code.toUpperCase()]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;