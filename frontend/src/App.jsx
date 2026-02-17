import { useState, useEffect } from "react";
import WeatherCharts from "./WeatherCharts";

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/weather/kathmandu`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
  
  fetchWeather()

  }, [])
  

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto mb-12">

        <h1 className="text-4xl font-bold text-center mb-8">
          🌤 Weather Dashboard
        </h1>

        {loading && (
          <p className="text-center text-lg font-semibold">Loading...</p>
        )}

        {weatherData && 
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-indigo-600 text-white rounded-md p-4 shadow-lg">
              <p className="text-xl font-bold">Temperature</p>
              <p>{weatherData.temperature} &deg;C</p>
              </div>
            <div className="bg-indigo-600 text-white rounded-md p-4 shadow-lg">
            <p className="text-xl font-bold">Rel. Humidity</p>
              <p>{weatherData.humidity} %</p>
            </div>
            <div className="bg-indigo-600 text-white rounded-md p-4 shadow-lg">
              <p className="text-xl font-bold">Pressure</p>
              <p>{weatherData.pressure} hPa</p>
            </div>
            <div className="bg-indigo-600 text-white rounded-md p-4 shadow-lg">
              <p className="text-xl font-bold">Wind Speed</p>
              <p>{weatherData.wind_speed} m/s</p>
            </div>
          </div>

        }
        
      </div>

      <WeatherCharts/>
    </div>
  );
}

export default App;
