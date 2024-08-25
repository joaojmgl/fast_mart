'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('finance', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.ENUM('Venda', 'Compra'),
        allowNull: false,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      payment_method: {
        type: Sequelize.ENUM('Dinheiro', 'Cartão de credito', 'Cartão de débito', 'Pix'),
        allowNull: false,
      },
      company_id: { // Campo que armazena o ID do usuário associado a este endereço
        type: Sequelize.INTEGER, // Tipo de dado do campo: inteiro
        allowNull: false, // Não permite valores nulos (deve ser sempre preenchido)
        references: { model: 'companies', key: 'id' }, // Estabelece uma referência ao modelo 'users' e à chave primária 'id' deste modelo
        onUpdate: 'CASCADE', // Define a ação a ser tomada quando o ID do usuário associado a este endereço for atualizado (neste caso, CASCADE indica que a atualização será propagada para este campo)
        onDelete: 'CASCADE', // Define a ação a ser tomada quando o usuário associado a este endereço for excluído (neste caso, CASCADE indica que a exclusão deste usuário também resultará na exclusão deste endereço)
      },
      cash_register: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.addConstraint('finance', {
      fields: ['id', 'company_id'],
      type: 'unique',
      name: 'finance_pkey'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('finance');
  },
};