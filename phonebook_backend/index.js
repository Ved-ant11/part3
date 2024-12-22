const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
const morgan = require("morgan");

morgan.token("postData", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :postData")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/persons", (req, res) => {
    res.json(persons);
});




app.get("/api/info", (req,res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
        <br/>
        <p>${date}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id == id);
    person ? res.json(person) : res.send.status(404).end();
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    person = persons.filter(person => person.id !== id);
    res.status(204).end();
})
const generateID = () =>{
    const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
    return maxId + 1;
}
app.post("/api/persons", (req, res) => {
    const body = req.body;

    if(!body.name || !body.number){
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    
    if(persons.find(person => person.name === body.name)){
        return res.json({ error: "name must be unique" });
    }

    const person = {
        "id" : generateID(),
        "name" : body.name,
        "number" : body.number
    }

    persons = persons.concat(person);

    res.json(person)

})

PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



