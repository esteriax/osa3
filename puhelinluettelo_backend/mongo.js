
const mongoose = require('mongoose')

//const url = `mongodb+srv://fullstack:${password}@cluster0.pjl2q7c.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`
const url = process.env.MONGODB_URI

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
if (process.argv.length > 3 && process.argv.length < 5) {
  console.log('give name and number as arguments')
  process.exit(1)
}

//const password = process.argv[2]
const nameArg = process.argv[3]
const numberArg = process.argv[4]


mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true
  },
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: nameArg,
  number: numberArg
})

if (process.argv.length === 3) {
  console.log('puhelinluettelo:')   
  Person.find({}).then(result => {
    result.forEach(person => {
        console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
    }) 
}

else if (process.argv.length === 5) {
person.save().then(result => {
  console.log(nameArg + ' ' + numberArg + ' added to phonebook')
  mongoose.connection.close()
}) 
}

module.exports = mongoose.model('Person', personSchema)