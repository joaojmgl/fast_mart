'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('companies', 'comp_CNPJ')
    ]);
  },

  async down (queryInterface, Sequelize) {
   return Promise.all([
      queryInterface.addColumn('companies', 'comp_CNPJ', {
          Type: Sequelize.STRING,
          allowNull: true,
      })
    ]);
  }
};
