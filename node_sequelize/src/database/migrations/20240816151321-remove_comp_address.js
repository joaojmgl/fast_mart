'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.removeColumn('company', 'comp_address', {})


    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.addColumn('company', 'comp_address', {
            type: Sequelize.STRING,
            allowNull: false,
        }),
    ]);
  }
};
