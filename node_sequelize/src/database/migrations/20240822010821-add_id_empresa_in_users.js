'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([

       queryInterface.removeColumn('users', 'id'),
       queryInterface.addColumn('users', 'id_empresa', {
         type: Sequelize.INTEGER,
         allowNull: false,
         // Aqui você pode definir o comportamento desejado da nova coluna
       }),
      queryInterface.addConstraint('users', {
        fields: ['id_empresa'],
        type: 'foreign key',
        name: 'fk_company_address',  // Nome opcional da constraint
        references: {
          table: 'company',
          field: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
       queryInterface.addColumn('users', 'id', {
         type: Sequelize.INTEGER,
         primaryKey:true,
         autoIncrement: true,
         allowNull: false
         // Aqui você pode definir o comportamento desejado da nova coluna
       }),
       queryInterface.addConstraint('users', {
         fields: ['id', 'id_empresa'],
         type: 'unique',
         name: 'id_composta'
       })
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'id_empresa'),
      // queryInterface.removeConstraint('users', 'id_empresa'),
      queryInterface.removeColumn('users', 'id'),
      // queryInterface.removeConstraint('users', 'id_composta')
    ])
  }
};
