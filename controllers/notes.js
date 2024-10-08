// Aqui estoy creando un nuevo objeto router, y lo exporto al final. Ahora todas las rutas estan definidas para el objeto enrutador.
//* Que es exactamente un objeto enrutador segun Express?: Un objeto de enrutador es un instancia aislada de middleware y rutas. Puedes pensar en ella como una "mini-aplicación", capaz solo de realizar funciones de middleware y enrutamiento. Cada aplicación Express tiene un enrutador de aplicación incorporado.
const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

// esta funcion aisla el token del encabezado 'authorization'
const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// then
// notesRouter.get('/', (request, response) => {
//   Note.find({}).then((notes) => {
//     response.json(notes)
//   })
// })

// async-await
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

// then
// notesRouter.get('/:id', (request, response, next) => {
//   Note.findById(request.params.id)
//     .then((note) => {
//       if (note) {
//         response.json(note)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch((error) => next(error))
// })

// async-await
notesRouter.get('/:id', async (request, response) => {
  // try {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  // } catch (exception) {
  //   next(exception)
  // }
})

// async-await
notesRouter.post('/', async (request, response) => {
  const body = request.body
  // la validez del token se comprueba con jwt.verify. El metodo tambien decodifica el token, o devuelve el objeto en el que se baso el token.
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  })

  const savedNote = await note.save()
  // el id de la nota se almacena en el campo notes del objeto user.
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)

  // then.
  // note
  //   .save()
  //   .then((savedNote) => {
  //     response.status(201).json(savedNote)
  //   })
  //   .catch((error) => next(error))
})

// async-await
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()

  // * Con la libreria express-async-error puedo prescindir del bloque try-catch para intentar captar los errores en catch. Tampoco necesito llamar a next(exception). La libreria se encarga de todo lo que hay debajo del capó. Si ocurre una excepcion en una ruta async, la ejecucion se pasa automaticamente al middleware de manejo de errores.

  // try-catch
  // try {
  //   const deletedNote = await Note.findByIdAndDelete(request.params.id)
  //   if (deletedNote) {
  //     response.status(204).end()
  //   } else {
  //     response.status(404).end()
  //   }
  // } catch (exception) {
  //   next(exception)
  // }

  // then.
  // Note.findByIdAndDelete(request.params.id)
  //   .then((result) => {
  //     if (result) {
  //       response.status(204).end()
  //     } else {
  //       response.status(404).end()
  //     }
  //   })
  //   .catch((error) => next(error))
})

notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body

  // try {
  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(updatedNote)
  // } catch (error) {
  //   next(error)
  // }

  // Note.findByIdAndUpdate(
  //   request.params.id,
  //   { content, important },
  //   { new: true, runValidators: true, context: 'query' }
  // )
  //   .then((updatedNote) => {
  //     response.json(updatedNote)
  //   })
  //   .catch((error) => next(error))
})

module.exports = notesRouter
