import requests
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

# Database connection
conn = psycopg2.connect(
    dbname="nationiq",
    user=os.getenv("DB_USER", "rainaajitjohn"),
    host="localhost",
    port="5432"
)
cur = conn.cursor()

print("Fetching country data from World Bank...")
response = requests.get(
    "https://api.worldbank.org/v2/country?format=json&per_page=300"
)
data = response.json()
countries = data[1]

print(f"Got {len(countries)} countries. Inserting into database...")

for country in countries:
    try:
        name = country.get('name', '')
        iso_code = country.get('iso2Code', '').strip()
        region = country.get('region', {}).get('value', '')
        capital = country.get('capitalCity', '')

        # Skip aggregates/regions (they have no iso2 code)
        if not iso_code or len(iso_code) != 2:
            continue

        cur.execute("""
            INSERT INTO countries (name, iso_code, region, capital)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (iso_code) DO NOTHING
        """, (name, iso_code, region, capital))

    except Exception as e:
        print(f"Error inserting {country}: {e}")

conn.commit()
cur.close()
conn.close()
print("Done! Countries inserted successfully.")