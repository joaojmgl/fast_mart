'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('finance', 'description', {
        type: Sequelize.ENUM('Venda','Compra'),
        allowNull: false,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('finance', 'description')
    ])
  }
};
