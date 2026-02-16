from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, TIMESTAMP

Base = declarative_base()

class WeatherData(Base):
    __tablename__ = "weather_data"
    id = Column(Integer, primary_key=True)
    city = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    pressure = Column(Float)
    created_at = Column(TIMESTAMP)
    data_retrieved_at = Column(TIMESTAMP)