import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/weather/${city}`
      );
      const data = await response.json();

      // Format timestamp for chart
      const formatted = data.map((item) => ({
        ...item,
        time: new Date(item.retrieved_at).toLocaleString(),
      }));

      setWeatherData(formatted);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const latest = weatherData[weatherData.length - 1];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-indigo-500 to-purple-600 p-8 text-white">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-8">
          🌤 Weather Dashboard
        </h1>

        {/* Search */}
        <div className="flex justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Enter city..."
            className="px-4 py-2 rounded-lg w-64 text-black"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={fetchWeather}
            className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="text-center text-lg font-semibold">Loading...</p>
        )}

        {latest && (
          <>
            {/* Main Temperature Card */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-center mb-10 shadow-lg">
              <h2 className="text-2xl mb-2">{city.toUpperCase()}</h2>
              <p className="text-6xl font-bold">
                {latest.temperature}°C
              </p>
              <p className="text-lg mt-2 opacity-80">
                Latest Update: {latest.time}
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow">
                <p className="text-lg">💧 Humidity</p>
                <p className="text-3xl font-bold">
                  {latest.humidity}%
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow">
                <p className="text-lg">🌬 Wind Speed</p>
                <p className="text-3xl font-bold">
                  {latest.wind_speed} m/s
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow">
                <p className="text-lg">🌡 Pressure</p>
                <p className="text-3xl font-bold">
                  {latest.pressure} hPa
                </p>
              </div>
            </div>

            {/* Temperature Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-black">
              <h3 className="text-xl font-semibold mb-4">
                Temperature History
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#6366f1"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
