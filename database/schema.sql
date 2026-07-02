CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  iso_code CHAR(2) UNIQUE NOT NULL,
  region VARCHAR(100),
  capital VARCHAR(100),
  flag_url TEXT,
  currency_code CHAR(3),
  currency_name VARCHAR(100)
);

CREATE TABLE country_stats (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id),
  year INTEGER NOT NULL,
  gdp NUMERIC,
  gdp_growth_rate NUMERIC,
  population BIGINT,
  birth_rate NUMERIC,
  life_expectancy NUMERIC,
  unemployment_rate NUMERIC,
  inflation_rate NUMERIC,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exchange_rates (
  id SERIAL PRIMARY KEY,
  currency_code CHAR(3) NOT NULL,
  rate_to_usd NUMERIC NOT NULL,
  date DATE NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  home_country CHAR(2),
  home_currency CHAR(3),
  passport_country CHAR(2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, country_id)
);

CREATE TABLE visa_requirements (
  id SERIAL PRIMARY KEY,
  passport_country CHAR(2) NOT NULL,
  destination_country CHAR(2) NOT NULL,
  visa_type VARCHAR(50) NOT NULL,
  stay_duration INTEGER,
  notes TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(passport_country, destination_country)
);

CREATE TABLE cost_of_living (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id),
  cost_of_living_index NUMERIC,
  rent_index NUMERIC,
  groceries_index NUMERIC,
  restaurant_index NUMERIC,
  purchasing_power_index NUMERIC,
  year INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);