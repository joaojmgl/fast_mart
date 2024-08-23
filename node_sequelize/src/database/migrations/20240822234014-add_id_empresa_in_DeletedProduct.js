'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('DeletedProduct', 'id'),
      queryInterface.addColumn('DeletedProduct', 'id_empresa', {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Aqui você pode definir o comportamento desejado da nova coluna
      }),
      queryInterface.addConstraint('DeletedProduct', {
        fields: ['id_empresa'],
        type: 'foreign key',
        name: 'fk_id_empresa_DeletedProduct',  // Nome opcional da constraint
        references: {
          table: 'company',
          field: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
      queryInterface.addColumn('DeletedProduct', 'id', {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull: false
        // Aqui você pode definir o comportamento desejado da nova coluna
      }),
      queryInterface.addConstraint('DeletedProduct', {
        fields: ['id', 'id_empresa'],
        type: 'unique',
        name: 'id_composta'
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.removeConstraint('DeletedProduct', 'id_empresa'),
      // queryInterface.removeConstraint('DeletedProduct', 'id_composta'),
      // queryInterface.removeColumn('DeletedProduct', 'id_empresa'),
      // queryInterface.removeColumn('DeletedProduct', 'id'),
    ])
  }
};
