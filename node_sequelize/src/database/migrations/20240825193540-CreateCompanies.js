'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('companies',{
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      comp_name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      comp_cnpj:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      comp_employees:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('companies');
  }
};
