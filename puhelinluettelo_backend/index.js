const express = require('express')
const app = express()

let persons = [
  {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345",
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
    }
]

app.use(express.json())

app.get('/', (request, response) => {
  console.log('Yritetään hakea etusivua')
  const viesti = 
  'Phonebook has info for ' + persons.length + ' people</p><p>' + new Date() + '</p>'
  response.send(viesti)
  console.log('Etusivu haettu')
})

app.get('/api/persons', (request, response) => {
  console.log('Yritetään hakea henkilöitä')
  response.json(persons)
  console.log('Kaikki henkilöt haettu')
})

app.get('/api/persons/:id', (request, response) => {
  console.log('Yritetään hakea henkilöä')
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  console.log(person.name + ' haettu')
})

/*
const generateId = () => {
  const id = Math.random(1000) 
  return String(id)
}
  */

app.post('/api/persons', (request, response) => {
  console.log('Yritetään lisätä henkilö')
  const body = request.body

  if (!body.name || !body.number) {
    console.log('Nimi tai numero puuttuu')
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  if (persons.find((person) => person.name === body.name)) {
    console.log('Henkilö ' + body.name + ' on jo luettelossa')
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000)
  }

  persons = persons.concat(person)

  response.json(person)
  console.log(person.name + ' lisätty')
})

app.delete('/api/persons/:id', (request, response) => {
  console.log('Yritetään poistaa henkilö' + request.params.name)
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
  console.log(person.name + ' poistettu')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})