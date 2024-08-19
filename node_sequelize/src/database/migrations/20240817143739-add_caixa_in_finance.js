'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('finance', 'cash_register', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('finance', 'cash_register')

    ])
  }
};
