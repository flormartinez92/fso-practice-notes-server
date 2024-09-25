// const http = require("http");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const Note = require("./models/note");
const note = require("./models/note");

// * CORS
app.use(cors());

// * Sin json-parser, la propiedad body no estaría definida. El json-parser funciona para que tome los datos JSON de una solicitud, los transforme en un objeto JavaScript y luego los adjunte a la propiedad body del objeto request antes de llamar al controlador de ruta.
app.use(express.json());

//! Middleware
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

//* Middleware static
app.use(express.static("dist"));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// const app = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "application/json" });
//   res.end(JSON.stringify(notes));
// });

//! Se mueve la configuración de la BD a su propio modulo, dentro del directorio "models", en el archivo "note.js"
// -------------- DB config ---------------- //

// const mongoose = require("mongoose");

// // Mongo Atlas password
// const password = process.argv[2];

// const url = `mongodb+srv://martinezmf92:${password}@cluster0.sf12dbb.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url);

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// });

// // Aqui formateo el objeto devuelto por moongose, usando el metodo toJSON. _id parece un string pero en realidad es un objeto. Modificarlo ahora implica evitar problemas en el futuro.
// noteSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

// const Note = mongoose.model("Note", noteSchema);

// -------------- DB config ---------------- //

app.get("/", (request, response) => {
  response.send("<h1>¡Hello World!!</h1>");
});

// Obtener todas las notas || GET
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Obtener una nota por ID || GET
app.get("/api/notes/:id", (request, response) => {
  // const id = Number(request.params.id);
  // const note = notes.find((note) => note.id === id);
  // if (note) {
  //   response.json(note);
  // } else {
  //   response.status(404).end();
  // }
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

// Borrar una nota por ID || DELETE
app.delete("/api/notes/:id", (request, response) => {
  // const id = Number(request.params.id);
  // notes = notes.filter((note) => note.id !== id);
  // response.status(204).end();
  Note.findByIdAndDelete(request.params.id).then((result) => {
    response.sendStatus(204);
  });
});

// //* ¿Qué está sucediendo exactamente en esa línea de código? notes.map(n => n.id) crea un nuevo array que contiene todos los ids de las notas. Math.max devuelve el valor máximo de los números que se le pasan. Sin embargo, notes.map(n => n.id) es un array, por lo que no se puede asignar directamente como parámetro a Math.max. El array se puede transformar en números individuales mediante el uso de la sintaxis de spread (tres puntos) ...
// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

// Crear una nueva nota || POST
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    // id: generateId(),
  });

  // notes = notes.concat(note);

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

//! Middleware para manejar solicitudes desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
