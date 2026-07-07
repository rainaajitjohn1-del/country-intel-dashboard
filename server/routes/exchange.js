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
// Cost of living comparison
router.get('/col/:homeCountry/:foreignCountry', async (req, res) => {
  try {
    const { homeCountry, foreignCountry } = req.params;

    const result = await pool.query(
      `SELECT c.name, c.iso_code, col.cost_of_living_index, col.rent_index, 
              col.groceries_index, col.restaurant_index, col.purchasing_power_index
       FROM cost_of_living col
       JOIN countries c ON col.country_id = c.id
       WHERE c.iso_code = ANY($1)`,
      [[homeCountry.toUpperCase(), foreignCountry.toUpperCase()]]
    );

    if (result.rows.length < 2) {
      return res.status(404).json({ error: 'Cost of living data not available for one or both countries' });
    }

    const home = result.rows.find(r => r.iso_code === homeCountry.toUpperCase());
    const foreign = result.rows.find(r => r.iso_code === foreignCountry.toUpperCase());

    const ratio = parseFloat(foreign.cost_of_living_index) / parseFloat(home.cost_of_living_index);

    res.json({
      home,
      foreign,
      ratio: ratio.toFixed(2),
      verdict: ratio > 1 ? 'more expensive' : 'cheaper',
      percentage: Math.abs((ratio - 1) * 100).toFixed(1)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
// Currency strength comparison
router.get('/strength/:homeCurrency/:foreignCurrency', async (req, res) => {
  try {
    const { homeCurrency, foreignCurrency } = req.params;
    
    const result = await pool.query(
      `SELECT currency_code, rate_to_usd FROM exchange_rates
       WHERE currency_code = ANY($1)
       ORDER BY date DESC`,
      [[homeCurrency.toUpperCase(), foreignCurrency.toUpperCase()]]
    );

    if (result.rows.length < 2) {
      return res.status(404).json({ error: 'One or both currencies not found' });
    }

    const rates = {};
    result.rows.forEach(row => {
      rates[row.currency_code] = parseFloat(row.rate_to_usd);
    });

    const homeRate = rates[homeCurrency.toUpperCase()];
    const foreignRate = rates[foreignCurrency.toUpperCase()];

    // How much foreign currency does 1 unit of home currency get you
    const strength = foreignRate / homeRate;

    let message = '';
    if (strength > 1) {
      message = `Your ${homeCurrency.toUpperCase()} is strong here — 1 ${homeCurrency.toUpperCase()} = ${strength.toFixed(2)} ${foreignCurrency.toUpperCase()}`;
    } else {
      message = `Your ${homeCurrency.toUpperCase()} is weak here — 1 ${homeCurrency.toUpperCase()} = ${strength.toFixed(2)} ${foreignCurrency.toUpperCase()}`;
    }

    res.json({
      homeCurrency: homeCurrency.toUpperCase(),
      foreignCurrency: foreignCurrency.toUpperCase(),
      strength: strength.toFixed(4),
      message,
      verdict: strength > 1 ? 'strong' : 'weak'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});