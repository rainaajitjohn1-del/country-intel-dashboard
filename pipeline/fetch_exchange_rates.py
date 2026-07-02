import requests
import psycopg2
from dotenv import load_dotenv
from datetime import date
import os

load_dotenv()

conn = psycopg2.connect(
    dbname="nationiq",
    user=os.getenv("DB_USER", "rainaajitjohn"),
    host="localhost",
    port="5432"
)
cur = conn.cursor()

print("Fetching exchange rates...")
response = requests.get("https://open.er-api.com/v6/latest/USD")
data = response.json()

if data.get('result') == 'success':
    rates = data.get('rates', {})
    today = date.today()
    
    print(f"Got {len(rates)} currency rates. Inserting...")
    
    for currency_code, rate in rates.items():
        try:
            cur.execute("""
                INSERT INTO exchange_rates (currency_code, rate_to_usd, date)
                VALUES (%s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (currency_code, rate, today))
        except Exception as e:
            print(f"Error inserting {currency_code}: {e}")
    
    conn.commit()
    print("Done! Exchange rates inserted successfully.")
else:
    print("Failed to fetch exchange rates")

cur.close()
conn.close()