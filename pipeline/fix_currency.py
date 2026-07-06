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

print("Fetching country data from mledoze dataset...")
response = requests.get("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")
data = response.json()

print(f"Got {len(data)} countries. Updating...")
updated = 0

for country in data:
    try:
        iso2 = country.get('cca2', '')
        currencies = country.get('currencies', {})
        flags = country.get('flags', {})
        flag_url = flags.get('png', '')

        if currencies:
            currency_code = list(currencies.keys())[0]
            currency_name = list(currencies.values())[0].get('name', '')

            cur.execute("""
                UPDATE countries
                SET currency_code = %s, currency_name = %s, flag_url = %s
                WHERE iso_code = %s
            """, (currency_code, currency_name, flag_url, iso2))
            updated += 1

    except Exception as e:
        print(f"Error updating {iso2}: {e}")

conn.commit()
print(f"Done! Updated {updated} countries.")
cur.close()
conn.close()