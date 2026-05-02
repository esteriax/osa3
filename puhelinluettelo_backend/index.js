require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()

var morgan = require('morgan')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

morgan.token('body', (req) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [ ]

app.get('/info', (request, response) => {
  console.log('Yritetään hakea info-sivua')
    Person.countDocuments({}).then(count => {
      const viesti = 
      'Phonebook has info for ' + count + ' people</p><p>' + new Date() + '</p>'
      response.send(viesti)
      console.log('Info-sivu haettu')
    })
})

app.get('/api/persons', (request, response, next) => {
  console.log('Yritetään hakea henkilöitä')
  Person.find ({}).then(persons => {
    response.json(persons)
  })
  .catch((error) => next(error))
  console.log('Kaikki henkilöt haettu')
})

app.get('/api/persons/:id', (request, response, next) => {
  console.log('Yritetään hakea henkilöä')
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch((error) => next(error))
  console.log('Henkilö haettu')
  })
  
/*
const generateId = () => {
  const id = Math.random(1000) 
  return String(id)
}*/

app.post('/api/persons', (request, response, next) => {
  console.log('Yritetään lisätä henkilö')
  const body = request.body

  if (!body.name || !body.number) {
    console.log('Nimi tai numero puuttuu')
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  if (body.name.length < 3) {
    console.log('Nimi on liian lyhyt')
    return response.status(400).json({
      error: ' is under 3 characters',
    })
  }

  if (persons.find((person) => person.name === body.name)) {
    console.log('Henkilö ' + body.name + ' on jo luettelossa')
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000)
  })

  person.save().then(savedPerson => { 
    response.json(savedPerson)
    console.log(person.name + ' lisätty')
  })
  .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log('Yritetään poistaa henkilö')
  Person.findByIdAndDelete(request.params.id)
  .then((result) => {
    response.status(204).end()
  })
  .catch((error) => next(error))
  console.log('Henkilö poistettu')
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})