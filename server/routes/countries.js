const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all countries
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, iso_code, region, capital, flag_url, currency_code, currency_name 
       FROM countries 
       WHERE currency_code IS NOT NULL AND capital != ''
       ORDER BY name`
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
      `SELECT id, name, iso_code, region, capital, flag_url, currency_code, currency_name 
       FROM countries 
       WHERE name ILIKE $1 AND currency_code IS NOT NULL AND capital != ''
       ORDER BY name`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get visa requirements for a passport country
router.get('/visa/:passport_code', async (req, res) => {
  try {
    const { passport_code } = req.params;
    const result = await pool.query(
      `SELECT vr.destination_country, vr.visa_type, vr.stay_duration, c.name, c.flag_url, c.region
       FROM visa_requirements vr
       LEFT JOIN countries c ON c.iso_code = vr.destination_country
       WHERE vr.passport_country = $1
       ORDER BY vr.visa_type, c.name`,
      [passport_code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No visa data found for this passport' });
    }

    const grouped = {
      visa_free: result.rows.filter(r => r.visa_type === 'visa_free'),
      visa_on_arrival: result.rows.filter(r => r.visa_type === 'visa_on_arrival'),
      e_visa: result.rows.filter(r => r.visa_type === 'e_visa'),
      visa_required: result.rows.filter(r => r.visa_type === 'visa_required'),
      no_admission: result.rows.filter(r => r.visa_type === 'no_admission'),
    };

    res.json({
      passport: passport_code.toUpperCase(),
      total: result.rows.length,
      summary: {
        visa_free: grouped.visa_free.length,
        visa_on_arrival: grouped.visa_on_arrival.length,
        e_visa: grouped.e_visa.length,
        visa_required: grouped.visa_required.length,
        no_admission: grouped.no_admission.length,
      },
      countries: grouped
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get similar countries
router.get('/:iso_code/similar', async (req, res) => {
  try {
    const { iso_code } = req.params;

    const countryRes = await pool.query(
      `SELECT c.id, c.region, cs.gdp, cs.population
       FROM countries c
       LEFT JOIN country_stats cs ON cs.country_id = c.id
       WHERE c.iso_code = $1
       ORDER BY cs.year DESC LIMIT 1`,
      [iso_code.toUpperCase()]
    );

    if (countryRes.rows.length === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }

    const { id, region, gdp, population } = countryRes.rows[0];

    const result = await pool.query(
      `SELECT c.name, c.iso_code, c.flag_url, c.region, c.capital,
              cs.gdp, cs.population
       FROM countries c
       LEFT JOIN country_stats cs ON cs.country_id = c.id
       WHERE c.id != $1
         AND c.currency_code IS NOT NULL
         AND c.capital != ''
         AND cs.gdp IS NOT NULL
         AND cs.gdp BETWEEN $2 AND $3
         AND cs.year = (SELECT MAX(year) FROM country_stats WHERE country_id = c.id)
       ORDER BY ABS(cs.gdp - $4)
       LIMIT 4`,
      [
        id,
        parseFloat(gdp) * 0.2,
        parseFloat(gdp) * 5.0,
        parseFloat(gdp)
      ]
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