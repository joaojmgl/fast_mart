'use strict';

module.exports = {
  up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('companies', 'comp_cnpj', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ]);
  },

 down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('companies', 'comp_cnpj')
    ]);
  }
};
