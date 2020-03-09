'use strict'
const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'roles',
      ['ADMIN', 'AUDIENCE', 'WALL'].map((name, index) => ({
        id: uuid(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {})
  },
}
