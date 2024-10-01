// info para imprimir mensajes de registro normales
const info = (...params) => {
  console.log(...params)
}

// error para todos los mensajes de error
const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }
