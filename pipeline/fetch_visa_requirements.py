import psycopg2
from dotenv import load_dotenv
import os
import requests
import csv
import io

load_dotenv()

conn = psycopg2.connect(
    dbname="nationiq",
    user=os.getenv("DB_USER", "rainaajitjohn"),
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# Using the Passport Index dataset from GitHub
print("Fetching visa requirements data...")
url = url = "https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-tidy-iso2.csv"
response = requests.get(url)

if response.status_code != 200:
    print(f"Failed to fetch: {response.status_code}")
    exit()

reader = csv.DictReader(io.StringIO(response.text))
inserted = 0
errors = 0

for row in reader:
    try:
        passport = row.get('Passport', '').strip()
        destination = row.get('Destination', '').strip()
        requirement = row.get('Requirement', '').strip()

        if not passport or not destination or not requirement:
            continue

        # Map requirement to visa type
        if requirement == 'visa free' or requirement == '0':
            visa_type = 'visa_free'
        elif requirement == 'visa on arrival':
            visa_type = 'visa_on_arrival'
        elif requirement == 'e-visa':
            visa_type = 'e_visa'
        elif requirement == '-1' or requirement == 'no admission':
            visa_type = 'no_admission'
        else:
            visa_type = 'visa_required'

        # Try to parse stay duration
        try:
            stay_duration = int(requirement) if requirement.isdigit() else None
            if stay_duration is not None:
                visa_type = 'visa_free'
        except:
            stay_duration = None

        cur.execute("""
            INSERT INTO visa_requirements (passport_country, destination_country, visa_type, stay_duration)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (passport_country, destination_country) DO UPDATE
            SET visa_type = EXCLUDED.visa_type,
                stay_duration = EXCLUDED.stay_duration
        """, (passport, destination, visa_type, stay_duration))
        inserted += 1

    except Exception as e:
        errors += 1

conn.commit()
cur.close()
conn.close()
print(f"Done! Inserted {inserted} records. Errors: {errors}")