'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.addColumn('products', 'id_empresa', {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   // Aqui você pode definir o comportamento desejado da nova coluna
      // }),
      // queryInterface.addConstraint('products', {
      //   fields: ['id_empresa'],
      //   type: 'foreign key',
      //   name: 'fk_empresaId',  // Nome opcional da constraint
      //   references: {
      //     table: 'company',
      //     field: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // }),
      // queryInterface.addConstraint('products', {
      //   fields: ['id', 'id_empresa'],
      //   type: 'unique',
      //   name: 'id_composta'
      // })
      // queryInterface.addColumn('products', 'id_empresa', {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     table: `company`,
      //     field: `id`,
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // })
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('products', 'id_empresa'),
      // queryInterface.removeConstraint('products', 'fk_company_address'),
      // queryInterface.removeColumn('products', 'id'),
      queryInterface.removeConstraint('products', 'id_composta')
    ])
  }
};
