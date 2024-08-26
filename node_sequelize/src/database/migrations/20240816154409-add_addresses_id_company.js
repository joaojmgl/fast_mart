'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up :(queryInterface, Sequelize)=> {
    return Promise.all([

      //   queryInterface.addColumn('company', 'addresses_id', {
      //     type: Sequelize.INTEGER,
      //     allowNull: false
      //   }),
      // queryInterface.addConstraint('company', {
      //   fields: ['addresses_id'],
      //   type: 'foreign key',
      //   name: 'fk_company_address',  // Nome opcional da constraint
      //   references: {
      //     table: 'addresses',
      //     field: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // }),
      // queryInterface.addColumn('company', 'addresses_id', {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'addresses',
      //     key: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // })
    ]);
  },

  down: (queryInterface, Sequelize)=> {
    return Promise.all([
      // queryInterface.removeConstraint('companies', 'fk_companies_address'),

    ]);
  }
};
