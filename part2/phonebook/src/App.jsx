import { useState, useEffect } from 'react'
import personService from './services/persons' // Importation du service
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // 2.11 : Récupération initiale via le service
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // 2.12 : Ajout via le service
  const addPerson = (event) => {
    event.preventDefault()
    
    if (persons.some(p => p.name.toLowerCase() === newName.toLowerCase())) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  // 2.14 : Suppression via le service
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(`The person '${name}' was already deleted from server`)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToDisplay = persons.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with: <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
        <div><button type="submit">add</button></div>
      </form>

      <h3>Numbers</h3>
      <Persons personsToDisplay={personsToDisplay} deletePerson={deletePerson} />
    </div>
  )
}

export default App