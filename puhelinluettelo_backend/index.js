require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()
var morgan = require('morgan')
//const cors = require('cors')
//const mongoose = require('mongoose')


/*
const password = process.argv[2]
const nameArg = process.argv[3]
const numberArg = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.pjl2q7c.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)
*/

app.use(express.json())
morgan.token('body', (req) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//app.use(cors())
app.use(express.static('dist'))

let persons = [
]

app.get('/', (request, response) => {
  console.log('Yritetään hakea etusivua')
  const viesti = 
  'Phonebook has info for ' + persons.length + ' people</p><p>' + new Date() + '</p>'
  response.send(viesti)
  console.log('Etusivu haettu')
})

app.get('/api/persons', (request, response) => {
  console.log('Yritetään hakea henkilöitä')
  Person.find ({}).then(persons => {
    response.json(persons)
  })
  console.log('Kaikki henkilöt haettu')
})

app.get('/api/persons/:id', (request, response) => {
  console.log('Yritetään hakea henkilöä')
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  console.log('Henkilö haettu')
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

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000)
  })

  person.save().then(savedPerson => { 
    response.json(savedPerson)
    console.log(person.name + ' lisätty')
  })

})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  //console.log(typeof request.params.id, typeof persons[0].id)
  const personToBeDeleted = persons.find((person) => person.id === id)
  console.log('Yritetään poistaa henkilö ' + personToBeDeleted.name)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
  console.log(personToBeDeleted.name + ' poistettu')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

