'use strict';



module.exports = {
  up:(queryInterface, Sequelize) =>{
    return queryInterface.createTable('company',{
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
      comp_CNPJ:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      comp_address:{
        type: Sequelize.STRING,
        allowNull: false,
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
  down: (queryInterface, sequelize) =>{
    return queryInterface.dropTable('company');
  }

};