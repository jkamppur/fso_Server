require('dotenv').config()  // read variables from .env

const express = require('express')
const app = express()  // create express instanse
const morgan = require('morgan')  // logging middleware
const cors = require('cors') // Enable Cross-origin resource sharing 
const Person = require('./models/person')  // mongoose specific code

app.use(express.json())  // json parser
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))  // Settings for morgan logging
app.use(cors())
app.use(express.static('dist'))  // serve frontend from directory static

morgan.token('body', req => {  // Custom Logging for POST message
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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

    const newPerson = new Person({
      name: person.name,
      number: person.number
    })

    newPerson.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {

  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number},
    { new: true, runValidators: true } // context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
  

// Error handler middelware:
const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
  