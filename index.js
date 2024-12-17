const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())  // json parser
app.use(morgan('tiny'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
      },
      {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
      },
      {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
      },
      {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
      }
  ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    let date = Date().toLocaleString();
    let person_count = persons.length;
    response.send(`<p>Phonebook has info for ${person_count} people</p><p> ${date} </p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*10000)
}
 

app.post('/api/persons', (request, response) => {
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
  
    if (persons.filter(person2 => person2.name === person.name).length > 0) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    person.id = String(generateId())
    persons = persons.concat(person)

    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
  