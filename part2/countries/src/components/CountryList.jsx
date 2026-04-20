const CountryList = ({ countries, onShow }) => {
  if (countries.length > 10) return <p>Too many matches, specify another filter</p>
  if (countries.length === 0) return <p>No matches found</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {countries.map(c => (
        <li key={c.cca3} style={{ marginBottom: '5px' }}>
          {c.name.common} {' '}
          <button onClick={() => onShow(c)}>show</button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList