// * Moongose podria describirse como un object document mapper (ODM). Esta libreria sirve para guardar objetos JavaScript como documentos en Mongo.
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

// * Aqui formateo el objeto devuelto por moongose, usando el metodo toJSON. _id parece un string pero en realidad es un objeto. Modificarlo ahora implica evitar problemas en el futuro.
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Note', noteSchema)
