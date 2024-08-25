'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('addresses', { // NOME TEM QUE ESTAR SEMPRE NO PLURAL!!

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      company_id: { // Campo que armazena o ID do usuário associado a este endereço
        type: Sequelize.INTEGER, // Tipo de dado do campo: inteiro
        allowNull: false, // Não permite valores nulos (deve ser sempre preenchido)
        references: { model: 'companies', key: 'id' }, // Estabelece uma referência ao modelo 'users' e à chave primária 'id' deste modelo
        onUpdate: 'CASCADE', // Define a ação a ser tomada quando o ID do usuário associado a este endereço for atualizado (neste caso, CASCADE indica que a atualização será propagada para este campo)
        onDelete: 'CASCADE', // Define a ação a ser tomada quando o usuário associado a este endereço for excluído (neste caso, CASCADE indica que a exclusão deste usuário também resultará na exclusão deste endereço)
      },

      street: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      district: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      state: {
        type: Sequelize.STRING,
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
    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('addresses');
  }
};