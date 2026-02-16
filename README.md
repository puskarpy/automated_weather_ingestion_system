# 🌤 Automated Weather Ingestion System

This project automatically collects weather data for a city and stores it in a **PostgreSQL database**. It also provides a **FastAPI backend** to access all stored weather data.  

---

## 📝 What this project does

- Automatically fetches weather data from **MET Norway Weather API**.  
- Converts a city name into **latitude and longitude** using **geopy**.  
- Extracts key weather information: **temperature, humidity, wind speed, pressure, and timestamp**.  
- Stores all data in a **PostgreSQL database**.  
- Provides a **FastAPI backend** so you can query all stored weather data for a city.  
- The database keeps a **history of all past data** since the project started.  

> Note: Currently, the backend returns **all past weather data** for a city; date-range queries are not implemented yet.

---

## 🔄 Project Pipeline

Below is a simple diagram showing how the system works:

    User Input (City Name)
              │
              ▼
    🌍 Geopy (Get Latitude & Longitude)
              │
              ▼
    🌦 MET Norway Weather API
              │
              ▼
    🛠 ETL Script (weather_etl.py)
              │
              ▼
    🗄 PostgreSQL Database (weather_data table)
              │
              ▼
    🚀 FastAPI Backend (main.py)
              │
              ▼
    🌐 User / Browser (/weather/{city})


---

### 📌 Flow Explanation

1. User provides a **city name**.
2. `geopy` converts it into **latitude and longitude**.
3. The script fetches weather data from **MET Norway API**.
4. The ETL script processes and inserts data into **PostgreSQL**.
5. FastAPI reads data from the database.
6. The user accesses weather history via API endpoints.


## ⚡ Tech Stack & Libraries

| Component | Purpose |
|-----------|---------|
| **Python** | Programming language |
| **Requests** | Fetch data from MET Norway API |
| **geopy** | Convert city names to coordinates |
| **PostgreSQL** | Store weather data |
| **psycopg2 / SQLAlchemy** | Database connection & ORM |
| **FastAPI** | Backend API for querying data |
| **python-dotenv** | Securely store API keys and DB credentials |
| **Windows Task Scheduler / CRON** | Automate the ETL script |

---

## 🛠 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/automated_weather_ingestion_system.git
cd automated_weather_ingestion_system
```

2. **Create and activate a virtual environment**

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```
3. **Install dependencies**

```bash
pip install -r requirements.txt
```
4. **Set up `.env` file**

Create a `.env` file with your credentials:
```bash
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
```
5. **Set up PostgreSQL table**

```bash
CREATE TABLE weather_data(
    id SERIAL PRIMARY KEY,
    city VARCHAR(100),
    latitude FLOAT,
    longitude FLOAT,
    temperature FLOAT,
    humidity FLOAT,
    wind_speed FLOAT,
    pressure FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_retrieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
6. **Test the ETL script**
```bash
python weather_etl.py
```
- Fetches weather for your chosen city and inserts it into the database.

7. **Run the FastAPI backend**
```bash
fastapi dev main.py
```
- Visit `http://127.0.0.1:8000/docs` to test API endpoints.

## 📦 API Endpoints

- `GET /` → Returns a welcome message  
- `GET /weather/{city}` → Returns all past weather data for the city  

---

## ⏰ Automating Updates

- Use **Windows Task Scheduler** or **CRON** to run `weather_etl.py` automatically (e.g., every hour or daily).  
- Ensure the virtual environment is activated in your scheduled task.  

---

## 💡 Notes

- City names are **case-insensitive** in queries.  
- `.ipynb` files and `.ipynb_checkpoints` are ignored in Git.  
- The project is structured with separate files:

  - `weather_etl.py` → ETL script  
  - `database.py` → DB connection  
  - `models.py` → ORM models  
  - `main.py` → FastAPI backend  
