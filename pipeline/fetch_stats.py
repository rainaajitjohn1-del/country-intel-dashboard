import requests
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

conn = psycopg2.connect(
    dbname="nationiq",
    user=os.getenv("DB_USER", "rainaajitjohn"),
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# World Bank indicators
INDICATORS = {
    'gdp': 'NY.GDP.MKTP.CD',
    'gdp_growth_rate': 'NY.GDP.MKTP.KD.ZG',
    'population': 'SP.POP.TOTL',
    'birth_rate': 'SP.DYN.CBRT.IN',
    'life_expectancy': 'SP.DYN.LE00.IN',
    'unemployment_rate': 'SL.UEM.TOTL.ZS',
    'inflation_rate': 'FP.CPI.TOTL.ZG'
}

def fetch_indicator(indicator_code):
    url = f"https://api.worldbank.org/v2/country/all/indicator/{indicator_code}?format=json&per_page=1000&mrv=1"
    response = requests.get(url)
    data = response.json()
    if len(data) > 1 and data[1]:
        return data[1]
    return []

# Get all country ids from database
cur.execute("SELECT id, iso_code FROM countries")
country_map = {row[1]: row[0] for row in cur.fetchall()}

print("Fetching World Bank stats...")

# Fetch each indicator
all_data = {}
for stat_name, indicator_code in INDICATORS.items():
    print(f"Fetching {stat_name}...")
    records = fetch_indicator(indicator_code)
    for record in records:
        iso = record.get('countryiso3code', '')
        # Convert iso3 to iso2 using country code
        iso2 = record.get('country', {}).get('id', '')
        value = record.get('value')
        year = record.get('date')
        if iso2 and value is not None and year:
            key = (iso2, int(year))
            if key not in all_data:
                all_data[key] = {}
            all_data[key][stat_name] = value

print(f"Inserting stats for {len(all_data)} country-year combinations...")

for (iso2, year), stats in all_data.items():
    country_id = country_map.get(iso2)
    if not country_id:
        continue
    try:
        cur.execute("""
            INSERT INTO country_stats 
            (country_id, year, gdp, gdp_growth_rate, population, birth_rate, life_expectancy, unemployment_rate, inflation_rate)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
        """, (
            country_id, year,
            stats.get('gdp'),
            stats.get('gdp_growth_rate'),
            stats.get('population'),
            stats.get('birth_rate'),
            stats.get('life_expectancy'),
            stats.get('unemployment_rate'),
            stats.get('inflation_rate')
        ))
    except Exception as e:
        print(f"Error inserting {iso2} {year}: {e}")

conn.commit()
cur.close()
conn.close()
print("Done! Stats inserted successfully.")