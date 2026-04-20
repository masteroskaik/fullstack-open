const Weather = ({ city, weatherData }) => {
  if (!weatherData) return <p><i>(Météo non disponible sans clé API)</i></p>

  return (
    <div>
      <h3>Weather in {city}</h3>
      <p><b>Temperature:</b> {weatherData.main.temp} °C</p>
      <img 
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
        alt="Weather icon" 
      />
      <p><b>Wind:</b> {weatherData.wind.speed} m/s</p>
    </div>
  )
}

export default Weather