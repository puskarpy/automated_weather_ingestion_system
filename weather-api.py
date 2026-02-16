# Imports
import requests
from dotenv import load_dotenv
import os
from geopy.geocoders import Nominatim
import psycopg2

load_dotenv()
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Database Connection
try:
    conn = psycopg2.connect(database="postgres", host="localhost", user="postgres", password=DB_PASSWORD, port="5432")

except Exception as e:
    print("Database Connection Failed", e)


# Defining custom header for MET Weather API.
headers = {
    "User-Agent": "MyWeatherApp/1.0 puskarpy"
}


# Get latitude and Longitude
def GetLatAndLon(place):
    geolocator = Nominatim(user_agent="weather-project")
    location = geolocator.geocode(place)
    if location:
        print(location.address)
        return location.latitude, location.longitude
    else:
        return None, None


# Get all weather info 
def GetWeather(lat, lon):
    if lat == None:
        return None
        
    url = f"https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}"
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        return res.json()
    else:
        print(f"Error {res.status_code}")
        print(res.text)
        return None


# Get weather infos.
def GetWeatherInfo(data):
    try:
        timeseries = data['properties']['timeseries'][0]
        timestamp = timeseries['time']
        details = timeseries['data']['instant']['details']
        return {
            "temperature": details.get("air_temperature"),
            "humidity": details.get("relative_humidity"),
            "wind_speed": details.get("wind_speed"),
            "pressure": details.get("air_pressure_at_sea_level"),
            "timestamp": timestamp
            }
    except Exception as e:
        return f"Error: {e}"


# Creating a Schema
# Commeneted so that it doesnt run multiple times.

# cursor.execute("""CREATE TABLE weather_data(
# id SERIAL PRIMARY KEY,
# city VARCHAR(100),
# latitude FLOAT,
# longitude FLOAT,
# temperature FLOAT,
# humidity FLOAT,
# wind_speed FLOAT,
# pressure FLOAT,
# created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
# data_retrieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# )""")


# Insert data into database.
def InsertWeatherData(city, lat, lon, weather_data):
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO weather_data
    (city, latitude, longitude, temperature, humidity, wind_speed, pressure, created_at)
    VALUES(%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        city,
        lat,
        lon,
        weather_data["temperature"],
        weather_data["humidity"],
        weather_data["wind_speed"],
        weather_data["pressure"],
        weather_data["timestamp"],
    ))
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Data inserted for {city}.")


# Inserting values for Kathmandu
def main():
    city = "Kathmandu"
    lat, lon = GetLatAndLon(city)
    data = GetWeather(lat, lon)
    if data:
        weather_values = GetWeatherInfo(data)
        InsertWeatherData(city, lat, lon, weather_values)


if __name__ == "__main__":
    main()