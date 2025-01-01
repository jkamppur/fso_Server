// Teht 3.12

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const url = `mongodb+srv://jkamppur:${password}@cluster0.brsxk.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
const Person = mongoose.model('Person', personSchema)

if (process.argv.length!=5) {  // Print phonebook
  console.log("phonebook")
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`person ${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length==5) {  // Add new contact
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
