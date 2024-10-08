const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: [3, 'Username must be at leat 3 characters long'],
    match: [
      /^[a-zA-Z0-9]+$/,
      'Username can only contain alphanumeric characters',
    ],
  },
  name: String,
  passwordHash: String,
  // los identificadores de las notas se almacenan dentro del documento del usuario como una matriz de IDs de Mongo
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // el passwordHash no debe mostrarse
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
