const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

const initialUsers = [
  {
    username: 'Mickey',
    password: 'sekret',
    name: 'Sr. Mickey',
  },
  {
    username: 'Benji',
    password: 'sekret',
    name: 'Sr. Benji',
  },
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})

  // toJSON las transforma, modificando el id y quitando __v.
  return notes.map((note) => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})

  return users.map((u) => u.toJSON())
}

module.exports = {
  initialNotes,
  initialUsers,
  nonExistingId,
  notesInDb,
  usersInDb,
}
