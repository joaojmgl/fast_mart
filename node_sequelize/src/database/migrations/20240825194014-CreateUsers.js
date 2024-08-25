'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      // id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true, // Define 'id' como chave primária
      // },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      birthday_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      education: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_logged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      }
    });

    // Define uma chave primária composta com 'id' e 'company_id'
    await queryInterface.addConstraint('users', {
      fields: ['id', 'company_id'],
      type: 'unique',
      name: 'users_pkey'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove a tabela 'users'
    await queryInterface.dropTable('users');
  }
};