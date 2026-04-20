import { useState, useEffect } from 'react'
import personService from './services/persons'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const notify = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existing = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existing) {
      if (window.confirm(`${newName} is already added, replace number?`)) {
        personService.update(existing.id, { ...existing, number: newNumber })
          .then(returned => {
            setPersons(persons.map(p => p.id !== existing.id ? p : returned))
            notify(`Updated ${newName}`)
          })
          .catch(() => {
            notify(`Information of ${newName} has already been removed`, 'error')
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }
      return
    }

    personService.create({ name: newName, number: newNumber }).then(returned => {
      setPersons(persons.concat(returned))
      notify(`Added ${newName}`)
      setNewName('')
      setNewNumber('')
    })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        notify(`Deleted ${name}`)
      })
    }
  }

  const personsToDisplay = persons.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter filter={filter} handleFilterChange={(e) => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson} newName={newName} newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons personsToDisplay={personsToDisplay} deletePerson={deletePerson} />
    </div>
  )
}

export default App