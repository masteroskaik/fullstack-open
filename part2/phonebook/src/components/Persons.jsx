const Persons = ({ personsToDisplay }) => (
  <ul>
    {personsToDisplay.map(person => 
      <li key={person.name}>{person.name} {person.number}</li>
    )}
  </ul>
)
export default Persons