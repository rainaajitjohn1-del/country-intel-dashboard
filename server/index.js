const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const countriesRouter = require('./routes/countries');
const statsRouter = require('./routes/stats');
const exchangeRouter = require('./routes/exchange');

const app = express();
const PORT = process.env.PORT || 8000;
const authRouter = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/countries', countriesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/exchange', exchangeRouter);
app.use('/api/auth', authRouter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'NationIQ API is running' });
});

// Test database connection
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});