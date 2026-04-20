import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import Weather from './components/Weather'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  
  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => setCountries(res.data))
  }, [])

  // Filtrage dynamique
  const filtered = countries.filter(c => 
    c.name.common.toLowerCase().includes(query.toLowerCase())
  )

  // Gérer la sélection automatique (si un seul pays reste)
  useEffect(() => {
    if (filtered.length === 1) {
      setSelectedCountry(filtered[0])
    }
  }, [filtered.length])

  // Charger la météo seulement si un pays est sélectionné ET qu'on a une clé
  useEffect(() => {
    const api_key = import.meta.env.VITE_WEATHER_KEY
    if (selectedCountry && api_key) {
      const capital = selectedCountry.capital[0]
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(res => setWeather(res.data))
        .catch(err => console.error("Erreur Météo:", err))
    }
  }, [selectedCountry])

  const handleSearch = (e) => {
    setQuery(e.target.value)
    setSelectedCountry(null) 
    setWeather(null)
  }

  return (
    <div style={{ padding: '20px' }}>
      <div>
        find countries <input value={query} onChange={handleSearch} autoFocus />
      </div>

      {selectedCountry ? (
        <div style={{ marginTop: '20px' }}>
          <h1>{selectedCountry.name.common}</h1>
          <p>Capital: {selectedCountry.capital[0]}</p>
          <p>Area: {selectedCountry.area} km²</p>
          
          <h3>Languages:</h3>
          <ul>
            {Object.values(selectedCountry.languages).map(lang => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
          
          <img src={selectedCountry.flags.png} alt="Flag" width="160" style={{ border: '1px solid #ddd' }} />
          
          <Weather city={selectedCountry.capital[0]} weatherData={weather} />
        </div>
      ) : (
        <CountryList countries={filtered} onShow={setSelectedCountry} />
      )}
    </div>
  )
}

export default App