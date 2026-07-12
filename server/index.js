const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const countriesRouter = require('./routes/countries');
const statsRouter = require('./routes/stats');
const exchangeRouter = require('./routes/exchange');
const authRouter = require('./routes/auth');
const watchlistRouter = require('./routes/watchlist');

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/countries', countriesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/exchange', exchangeRouter);
app.use('/api/auth', authRouter);
app.use('/api/watchlist', watchlistRouter);

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;