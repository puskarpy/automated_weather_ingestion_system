import { useState, useEffect } from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip} from 'recharts'

export default function WeatherCharts() {

  const [weatherData, setWeatherData] = useState([])
  const [selectedDate, setSelectedDate] = useState("2026-02-16")
  const [metric, setMetric] = useState("temperature")

  useEffect(() => {

    const fetchWeatherData = async() => {
    const res = await fetch("http://localhost:8000/weather/kathmandu/all")
    const data = await res.json()
    
    const formattedData = data.map((item) => ({
      ...item,
      retrieved_at: new Date(item.data_retrieved_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute:"2-digit"
      })
    }))
    setWeatherData(formattedData)
  }
  
  fetchWeatherData()

  }, [])
  
  const uniqueDates = [
    ...new Set(weatherData.map((item) => 
    item.data_retrieved_at.split("T")[0]
  ))
  ]

  const filteredWeatherData = weatherData.filter((date) => date.data_retrieved_at.startsWith(selectedDate)).sort((a, b) => a.data_retrieved_at.localeCompare(b.data_retrieved_at))

  const colors = {
  temperature: "#ef4444",
  humidity: "#3b82f6",
  wind_speed: "#10b981",
  pressure: "#f59e0b",
};


  return (
    <div>WeatherCharts

        <div className='mb-6 mt-6'>
          <select 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)} 
          className='border-2 border-black' 
          name="" 
          id="">
            {
              uniqueDates.map((date, index) => (
                <option key={index} value={date}>{date}</option>
              ))
            }
          </select>
        </div>
        <div className="flex gap-3 my-4">

  {["temperature", "humidity", "wind_speed", "pressure"].map((m) => (
    <button
      key={m}
      onClick={() => setMetric(m)}
      className={`px-4 py-2 rounded-lg ${
        metric === m ? "bg-indigo-600 text-white" : "bg-gray-200"
      }`}
    >
      {m.replace("_", " ")}
    </button>
  ))}
</div>

  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={filteredWeatherData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="retrieved_at" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey={metric} stroke={colors[metric]} />
    </LineChart>
  </ResponsiveContainer>
    </div>
  )
}
