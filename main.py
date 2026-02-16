from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from schema import WeatherData
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"Hello World"}

@app.get("/weather/{city}")
def get_weather(city:str, db: Session = Depends(get_db)):
    data = db.query(WeatherData).filter(WeatherData.city.ilike(city))\
    .order_by(WeatherData.data_retrieved_at.desc()).first()
    if not data:
        return {"error": "City not found"}
    return {
        "city": data.city,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "wind_speed": data.wind_speed,
        "pressure": data.pressure,
        "retrieved_at": data.data_retrieved_at
    }

@app.get("/weather/{city}/all")
def get_all_weather(city: str, db: Session = Depends(get_db)):
    data = db.query(WeatherData).filter(WeatherData.city.ilike(city))\
    .order_by(WeatherData.data_retrieved_at.desc()).all()
    if not data:
        return {"error": "City not found"}
    return data
