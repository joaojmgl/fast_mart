'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('finance', 'id'),
      queryInterface.addColumn('finance', 'id_empresa', {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Aqui você pode definir o comportamento desejado da nova coluna
      }),
      queryInterface.addConstraint('finance', {
        fields: ['id_empresa'],
        type: 'foreign key',
        name: 'fk_id_empresa_finance',  // Nome opcional da constraint
        references: {
          table: 'company',
          field: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
      queryInterface.addColumn('finance', 'id', {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull: false
        // Aqui você pode definir o comportamento desejado da nova coluna
      }),
      queryInterface.addConstraint('finance', {
        fields: ['id', 'id_empresa'],
        type: 'unique',
        name: 'id_composta'
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.removeConstraint('users', 'id_empresa'),
      // queryInterface.removeConstraint('users', 'id_composta'),
      queryInterface.removeColumn('finance', 'id_empresa'),
      queryInterface.removeColumn('finance', 'id'),
    ])
  }
};
