'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.createTable('DeletedProduct', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true
    //   },
    //   name: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    //   },
    //   unit_of_measure: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    //   },
    //   purchase_price: {
    //     type: Sequelize.FLOAT,
    //     allowNull: false
    //   },
    //   quantity_per_unit: {
    //     type: Sequelize.FLOAT,
    //     allowNull: false
    //   },
    //   sale_price: {
    //     type: Sequelize.FLOAT,
    //     allowNull: false
    //   },
    //   expiry_date: {
    //     type: Sequelize.DATE,
    //     allowNull: false
    //   },
    //   supplier: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    //   },
    //   code: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false
    //   },
    //   deleted_at: {
    //     type: Sequelize.DATE,
    //     allowNull: true
    //   }
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.dropTable('DeletedProduct');
  }
};

