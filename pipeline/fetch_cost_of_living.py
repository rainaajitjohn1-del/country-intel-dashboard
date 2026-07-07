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

# Name mapping for countries with different names in our DB
name_map = {
    "Czech Republic": "Czechia",
    "Egypt": "Egypt, Arab Rep.",
    "South Korea": "Korea, Rep.",
    "Russia": "Russian Federation",
    "Slovakia": "Slovak Republic",
    "Yemen": "Yemen, Rep.",
    "Vietnam": "Viet Nam",
    "Turkey": "Turkiye",
}

# Numbeo 2026 Mid-Year Data
# (country_name, col_index, rent_index, groceries_index, restaurant_index, purchasing_power_index)
data = [
    ("Bermuda", 135.8, 105.9, 149.0, 136.8, 104.3),
    ("Switzerland", 109.8, 47.9, 109.5, 108.1, 165.7),
    ("Iceland", 97.6, 47.7, 106.3, 103.8, 113.6),
    ("Singapore", 90.8, 68.3, 84.9, 54.4, 91.3),
    ("Israel", 89.6, 35.2, 86.4, 96.5, 115.0),
    ("Norway", 85.5, 28.2, 89.4, 87.5, 123.2),
    ("Luxembourg", 78.6, 47.1, 78.1, 85.6, 155.1),
    ("Denmark", 78.6, 26.6, 74.3, 89.3, 141.2),
    ("Australia", 71.4, 33.1, 82.2, 66.7, 134.8),
    ("Ireland", 70.8, 41.4, 70.6, 76.3, 113.0),
    ("Austria", 70.8, 23.8, 72.1, 70.8, 114.2),
    ("United States", 69.7, 37.1, 76.4, 71.7, 144.5),
    ("Finland", 68.5, 20.1, 69.3, 74.1, 119.8),
    ("Belgium", 68.3, 22.0, 68.1, 77.3, 117.1),
    ("United Kingdom", 68.2, 30.1, 64.8, 72.4, 118.2),
    ("Germany", 68.0, 22.0, 64.6, 66.1, 130.0),
    ("France", 66.9, 20.6, 73.8, 64.7, 113.3),
    ("Sweden", 65.5, 20.1, 67.5, 67.1, 128.6),
    ("Canada", 61.3, 29.1, 69.2, 61.1, 114.8),
    ("Italy", 61.3, 18.9, 63.8, 64.2, 85.5),
    ("New Zealand", 60.2, 24.6, 67.5, 56.1, 119.4),
    ("Estonia", 59.4, 15.2, 55.3, 66.0, 88.7),
    ("Jamaica", 58.1, 18.5, 68.6, 52.0, 34.6),
    ("Cyprus", 57.4, 24.6, 54.5, 58.3, 81.3),
    ("Yemen", 57.1, 6.2, 74.7, 38.8, 16.6),
    ("Malta", 56.9, 27.2, 57.2, 63.0, 76.6),
    ("Costa Rica", 56.8, 21.1, 65.4, 50.6, 49.1),
    ("South Korea", 56.7, 13.6, 72.2, 32.8, 101.7),
    ("United Arab Emirates", 55.6, 36.3, 45.4, 57.9, 113.4),
    ("Trinidad And Tobago", 54.4, 14.1, 57.4, 48.9, 42.7),
    ("Uruguay", 54.0, 14.4, 54.2, 55.4, 56.8),
    ("Greece", 53.3, 12.9, 51.7, 57.2, 62.3),
    ("Slovenia", 53.2, 18.2, 52.7, 49.2, 87.0),
    ("Czech Republic", 52.0, 19.1, 50.7, 41.3, 89.2),
    ("Spain", 51.4, 22.3, 51.9, 53.9, 96.8),
    ("Latvia", 51.3, 10.7, 48.4, 51.2, 74.1),
    ("Croatia", 51.3, 16.1, 49.7, 53.2, 82.0),
    ("Lithuania", 50.2, 13.7, 47.1, 55.5, 87.5),
    ("Qatar", 50.2, 36.9, 41.8, 56.5, 168.1),
    ("Hungary", 49.8, 14.2, 49.7, 47.1, 77.3),
    ("Lebanon", 49.8, 17.3, 43.8, 48.0, 35.6),
    ("Portugal", 48.7, 23.5, 47.5, 45.7, 65.3),
    ("Slovakia", 48.5, 15.6, 50.0, 41.3, 73.4),
    ("Japan", 47.6, 13.6, 58.2, 30.8, 107.3),
    ("Bahrain", 46.8, 21.2, 45.6, 43.4, 117.3),
    ("Panama", 46.5, 21.7, 53.8, 42.9, 42.1),
    ("Poland", 46.2, 16.4, 41.0, 46.5, 94.7),
    ("Oman", 45.5, 12.0, 46.8, 40.4, 151.3),
    ("Saudi Arabia", 45.4, 12.4, 42.7, 34.0, 115.7),
    ("Guatemala", 45.4, 18.7, 53.7, 41.3, 32.8),
    ("Argentina", 44.9, 12.8, 43.8, 52.1, 44.8),
    ("Albania", 44.7, 11.9, 46.6, 39.3, 46.9),
    ("Mexico", 44.4, 17.1, 49.6, 44.6, 46.8),
    ("Kuwait", 43.1, 21.6, 37.2, 42.9, 175.8),
    ("Montenegro", 42.8, 15.7, 40.7, 45.8, 63.4),
    ("Serbia", 42.5, 11.8, 39.8, 42.7, 63.1),
    ("Bulgaria", 42.0, 10.6, 44.0, 42.6, 78.6),
    ("El Salvador", 41.6, 16.7, 45.5, 36.0, 26.8),
    ("Armenia", 40.9, 15.0, 38.4, 40.5, 47.4),
    ("Ethiopia", 40.4, 16.8, 40.7, 24.5, 12.5),
    ("Turkey", 40.2, 12.3, 40.0, 39.2, 71.8),
    ("Jordan", 39.9, 6.6, 37.2, 41.4, 55.3),
    ("Romania", 39.5, 11.0, 38.6, 40.9, 72.7),
    ("Dominican Republic", 39.4, 13.5, 40.3, 37.0, 40.4),
    ("Russia", 39.3, 12.5, 39.4, 36.3, 60.9),
    ("South Africa", 38.9, 12.8, 35.0, 36.2, 105.5),
    ("Chile", 38.7, 10.6, 42.4, 38.4, 50.4),
    ("Ghana", 38.1, 11.6, 42.1, 37.8, 18.1),
    ("Thailand", 36.8, 12.8, 43.5, 23.5, 41.0),
    ("Colombia", 35.6, 11.5, 37.6, 29.9, 40.0),
    ("Angola", 35.6, 17.4, 34.2, 29.1, 259.3),
    ("Cambodia", 35.1, 9.8, 43.1, 23.7, 22.6),
    ("Georgia", 34.9, 11.5, 35.1, 37.5, 43.2),
    ("Malaysia", 34.0, 8.5, 43.3, 23.2, 76.3),
    ("Brazil", 33.1, 8.6, 33.0, 29.8, 44.3),
    ("Kazakhstan", 32.7, 10.8, 34.1, 34.1, 52.1),
    ("Peru", 32.5, 9.8, 36.5, 26.3, 48.4),
    ("Morocco", 31.2, 7.6, 33.6, 24.8, 43.7),
    ("China", 30.7, 9.5, 36.3, 21.1, 94.2),
    ("Philippines", 29.1, 7.2, 35.3, 19.4, 32.1),
    ("Tunisia", 29.0, 5.0, 35.3, 18.0, 33.6),
    ("Ukraine", 29.0, 7.7, 30.2, 26.4, 48.1),
    ("Kenya", 28.9, 7.5, 30.5, 25.1, 33.4),
    ("Bolivia", 28.7, 8.5, 30.1, 22.5, 43.1),
    ("Iraq", 28.6, 6.8, 28.7, 25.6, 57.6),
    ("Uganda", 27.2, 9.7, 28.9, 24.0, 18.6),
    ("Algeria", 26.9, 3.2, 36.8, 15.8, 35.3),
    ("Vietnam", 26.9, 9.6, 32.6, 15.7, 40.5),
    ("Tanzania", 25.8, 7.7, 25.5, 19.7, 26.1),
    ("Indonesia", 24.7, 7.8, 32.6, 13.3, 28.5),
    ("Bangladesh", 22.7, 2.4, 27.4, 16.0, 32.8),
    ("Nepal", 21.9, 2.8, 22.7, 16.5, 29.9),
    ("Afghanistan", 21.6, 2.5, 20.2, 15.3, 38.5),
    ("Egypt", 21.5, 3.8, 22.5, 19.4, 23.9),
    ("Pakistan", 20.3, 3.1, 18.8, 17.7, 27.9),
    ("Nigeria", 20.2, 12.2, 22.7, 18.8, 8.8),
    ("India", 18.1, 3.8, 21.4, 14.3, 69.6),
]

print(f"Inserting cost of living data for {len(data)} countries...")
inserted = 0
not_found = []

for item in data:
    country_name, col, rent, groceries, restaurant, purchasing_power = item
    try:
        db_name = name_map.get(country_name, country_name)
        cur.execute("SELECT id FROM countries WHERE name ILIKE %s", (db_name,))
        result = cur.fetchone()
        if not result:
            not_found.append(country_name)
            continue
        country_id = result[0]

        cur.execute("""
            INSERT INTO cost_of_living 
            (country_id, cost_of_living_index, rent_index, groceries_index, restaurant_index, purchasing_power_index, year)
            VALUES (%s, %s, %s, %s, %s, %s, 2026)
            ON CONFLICT DO NOTHING
        """, (country_id, col, rent, groceries, restaurant, purchasing_power))
        inserted += 1
    except Exception as e:
        print(f"Error with {country_name}: {e}")

conn.commit()
cur.close()
conn.close()
print(f"Done! Inserted {inserted} records.")
if not_found:
    print(f"Countries not found in DB: {not_found}")