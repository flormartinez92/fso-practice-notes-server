const { test, describe } = require('node:test')
const assert = require('node:assert')

// Aca importo la función a ser probada, y la asigno a la variable 'reverse'
const reverse = require('../utils/for_testing').reverse

describe('reverse', () => {
  test('reverse of a', () => {
    const result = reverse('a')

    assert.strictEqual(result, 'a')
  })

  test('reverse of react', () => {
    const result = reverse('react')

    assert.strictEqual(result, 'tcaer')
  })

  test('reverse of saippuakauppias', () => {
    const result = reverse('saippuakauppias')

    assert.strictEqual(result, 'saippuakauppias')
  })
})
