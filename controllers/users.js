const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  // El argumento dado al método populate define que los ids que hacen referencia a objetos note en el campo notes del documento user serán reemplazados por los documentos de note referenciados.
  // Podemos usar el método populate para elegir los campos que queremos incluir de los documentos. Además del campo id, ahora solo nos interesan content e important.
  const users = await User.find({}).populate('notes', {
    content: 1,
    important: 1,
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
