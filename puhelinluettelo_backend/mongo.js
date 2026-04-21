
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
if (process.argv.length > 3 && process.argv.length < 5) {
  console.log('give name and number as arguments')
  process.exit(1)
}

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

