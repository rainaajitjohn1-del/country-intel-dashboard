const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get stats for a country by iso_code
router.get('/:iso_code', async (req, res) => {
  try {
    const { iso_code } = req.params;
    const result = await pool.query(
      `SELECT cs.* FROM country_stats cs
       JOIN countries c ON cs.country_id = c.id
       WHERE c.iso_code = $1
       ORDER BY cs.year DESC`,
      [iso_code.toUpperCase()]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get latest stats for a country
router.get('/:iso_code/latest', async (req, res) => {
  try {
    const { iso_code } = req.params;
    const result = await pool.query(
      `SELECT cs.* FROM country_stats cs
       JOIN countries c ON cs.country_id = c.id
       WHERE c.iso_code = $1
       ORDER BY 
         (CASE WHEN cs.gdp IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN cs.population IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN cs.birth_rate IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN cs.life_expectancy IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN cs.unemployment_rate IS NOT NULL THEN 1 ELSE 0 END) DESC,
         cs.year DESC
       LIMIT 1`,
      [iso_code.toUpperCase()]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No stats found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;