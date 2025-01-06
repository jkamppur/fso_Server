require('dotenv').config()  // read variables from .env

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())  // json parser
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))  // serve frontend from directory static

morgan.token('body', req => {  // Custom Logging for server
    if (req.method == "POST")
        result = JSON.stringify(req.body, ['name', 'number']);
    else
        result =  '';

    return result;
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    let date = Date().toLocaleString();
    Person.find({}).then(persons => {
        let person_count = persons.length;
        response.send(`<p>Phonebook has info for ${person_count} people</p><p> ${date} </p>`)
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById({id}).then(person => {
      response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

/*
const generateId = () => {
    return Math.floor(Math.random()*10000)
}
*/    
 
app.post('/api/persons', (request, response) => {
    console.log("post called")
    const person = request.body

    if (!person.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!person.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
  
    /*
    if (persons.filter(person2 => person2.name === person.name).length > 0) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
    */

    const newPerson = new Person({
      name: person.name,
      number: person.number
    })

    newPerson.save().then(savedPerson => {
      response.json(savedPerson)
    })

  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
  