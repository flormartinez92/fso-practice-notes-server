const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
// La prueba importa la aplicación Express del módulo app.js y la envuelve con la función supertest en un objeto llamado superagent. Este objeto se asigna a la variable api y las pruebas pueden usarlo para realizar solicitudes HTTP al backend.
const api = supertest(app)

const Note = require('../models/note')
const User = require('../models/user')

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'Mickey',
      name: 'Sr. Mickey',
      passwordHash,
    })

    await user.save()
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)

    // Promise.all se utiliza para transformar una serie de promesas en una unica promesa, que se cumplira una vez que se resuelva cada promesa en el array que se le pasa como argumento.
    // const noteObjects = helper.initialNotes.map((note) => new Note(note))
    // const promiseArray = noteObjects.map((note) => note.save())
    // await Promise.all(promiseArray)

    // await Note.deleteMany({})
    // console.log('cleared')

    // helper.initialNotes.forEach(async (note) => {
    //   let noteObject = new Note(note)
    //   await noteObject.save()
    //   console.log('saved')
    // })
    // console.log('done')

    // let noteObject = new Note(helper.initialNotes[0])
    // await noteObject.save()
    // noteObject = new Note(helper.initialNotes[1])
    // await noteObject.save()
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map((r) => r.content)

    assert(contents.includes('Browser can execute only JavaScript'))
  })

  test('there are two notes', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map((e) => e.content)
    // assert.strictEqual(contents.includes('HTML is easy'), true)
    // es el argumento truthy. De las dos formas esta bien.
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with statuscode 400 if id is invalid (malformatted)', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/notes/${invalidId}`).expect(400)
    })

    test('fails with statuscode 404 if id is not found', async () => {
      const nonExistentId = '664d2ada2fb61d6ddb986bd5'

      await api.get(`/api/notes/${nonExistentId}`).expect(404)
    })
  })

  describe('addition of a new note', () => {
    test('a valid note can be added by a user', async () => {
      const users = await helper.usersInDb()
      const user = users[0]

      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId: user.id,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map((n) => n.content)

      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('note without content is not added, fails with status code 400', async () => {
      const users = await helper.usersInDb()
      const user = users[0]

      const newNote = {
        important: true,
        userId: user.id,
      }

      await api.post('/api/notes').send(newNote).expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('a note can be deleted, succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

      const notesAtEnd = await helper.notesInDb()

      const contents = notesAtEnd.map((r) => r.content)
      assert(!contents.includes(noteToDelete.content))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
