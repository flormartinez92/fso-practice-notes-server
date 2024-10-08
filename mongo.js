const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

//* Cuando el código se ejecuta con el comando node mongo.js yourPassword, Mongo agregará un nuevo documento a la base de datos.
const password = process.argv[2]

//* Aca modificando la URI puedo determinar como sera el nombre de mi base de datos. En este caso "noteApp".
// const url = `mongodb+srv://martinezmf92:${password}@cluster0.sf12dbb.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
// mongodb+srv://martinezmf92:<db_password>@cluster0.sf12dbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// url test
const url = `mongodb+srv://martinezmf92:${password}@cluster0.sf12dbb.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

// conexion a la base de datos
mongoose.connect(url)

// Este es el schema de una nota. El schema le dice a Mongoose como se almacenaran los objetos de nota en la base de datos.
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// en el modelo Note, el primer parametro es el nombre de la colección en singular y mayuscula. El segundo parametro es el schema. La convencion de moongose es que el nombre de la colección en la base de datos sea el nombre de la colección en plural.
const Note = mongoose.model('Note', noteSchema)

// se crea un nuevo objeto de nota con el modelo "Note". Los modelos son funciones constructoras que crean nuevos objetos JS basados en los parametros proporcionados.
// const note = new Note({
//   content: 'Browser can execute only JavaScript',
//   important: true,
// })

// save es un metodo. Me permite guardar el objeto en la base de datos. Luego de que el objeto se guarda en la base de datos, el controlador de eventos proporcionado por "then" se invoca, y cierra la conexion de la base de datos. Si la conexion no se cierra, el programa nunca temrinara su ejecucion.
// note.save().then((result) => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// los objetos se recuperan de la base de datos con el metodo find del modelo "Note". El parametro del metodo es un objeto que expresa condiciones de busqueda.
Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
