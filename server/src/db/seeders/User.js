'use strict'
const { hashSync } = require('bcryptjs')
const uuid = require('uuid/v1')

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert(
      'users',
      Array.from({ length: 10 }, () => 'user').map((item, index) => ({
        id: uuid(),
        name: `w${index}`,
        email: `w${index}@w.w`,
        password: hashSync('w', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  },
}
