'use strict';

module.exports = {
  
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.createTable('products', {
      
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit_of_measure: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      purchase_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      quantity_per_unit: {
        type: Sequelize.FLOAT,
        allowNull: false,  
      },
      sale_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true, // Permitir nulo se a data de validade não for obrigatória
      },
      supplier: {
        type: Sequelize.STRING,
        allowNull: true, // Permitir nulo se o fornecedor não for obrigatório
      },
      code: {
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
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('products');
  }
};
