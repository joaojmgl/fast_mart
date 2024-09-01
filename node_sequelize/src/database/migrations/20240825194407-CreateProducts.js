'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('products', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
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
        allowNull: true,
      },
      supplier: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      company_id: { // Campo que armazena o ID do usuário associado a este endereço
        type: Sequelize.INTEGER, // Tipo de dado do campo: inteiro
        allowNull: false, // Não permite valores nulos (deve ser sempre preenchido)
        references: { model: 'companies', key: 'id' }, // Estabelece uma referência ao modelo 'users' e à chave primária 'id' deste modelo
        onUpdate: 'CASCADE', // Define a ação a ser tomada quando o ID do usuário associado a este endereço for atualizado (neste caso, CASCADE indica que a atualização será propagada para este campo)
        onDelete: 'CASCADE', // Define a ação a ser tomada quando o usuário associado a este endereço for excluído (neste caso, CASCADE indica que a exclusão deste usuário também resultará na exclusão deste endereço)
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
        .then(() => {
          return queryInterface.addConstraint('products', {
            fields: ['id', 'company_id'],
            type: 'unique',
            name: 'products_company_id_id_pk',
          });
        });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('products');
  }
}