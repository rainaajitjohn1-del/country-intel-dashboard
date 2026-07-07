import requests
import psycopg2
from dotenv import load_dotenv
from datetime import date, timedelta
import os
import time

load_dotenv()

conn = psycopg2.connect(
    dbname="nationiq",
    user=os.getenv("DB_USER", "rainaajitjohn"),
    host="localhost",
    port="5432"
)
cur = conn.cursor()

today = date.today()
inserted = 0

for i in range(1, 31):
    target_date = today - timedelta(days=i)
    date_str = target_date.strftime("%Y-%m-%d")

    try:
        url = f"https://api.frankfurter.app/{date_str}?from=USD"
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            print(f"Failed for {date_str}: {response.status_code}")
            continue

        data = response.json()
        rates = data.get('rates', {})

        for currency_code, rate in rates.items():
            try:
                cur.execute("""
                    INSERT INTO exchange_rates (currency_code, rate_to_usd, date)
                    VALUES (%s, %s, %s)
                    ON CONFLICT DO NOTHING
                """, (currency_code, rate, target_date))
                inserted += 1
            except Exception as e:
                pass

        conn.commit()
        print(f"Done {date_str} — {len(rates)} rates")
        time.sleep(0.3)

    except Exception as e:
        print(f"Error for {date_str}: {e}")

cur.close()
conn.close()
print(f"Total inserted: {inserted}")