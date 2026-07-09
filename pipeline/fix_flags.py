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

# Get all countries
cur.execute("SELECT id, iso_code FROM countries WHERE iso_code IS NOT NULL")
countries = cur.fetchall()

print(f"Updating flags for {len(countries)} countries...")
updated = 0

for country_id, iso_code in countries:
    if not iso_code or len(iso_code) != 2:
        continue
    
    # flagcdn.com provides flags for free using iso2 code
    flag_url = f"https://flagcdn.com/w320/{iso_code.lower()}.png"
    
    cur.execute(
        "UPDATE countries SET flag_url = %s WHERE id = %s",
        (flag_url, country_id)
    )
    updated += 1

conn.commit()
cur.close()
conn.close()
print(f"Done! Updated {updated} flags.")