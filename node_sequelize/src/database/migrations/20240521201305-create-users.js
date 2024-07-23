'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    // Criação da tabela 'users' com os campos necessários.

    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER, // Tipo da variável: INTEGER (número inteiro)
        primaryKey: true, // Define o campo 'id' como chave primária da tabela.
        autoIncrement: true, // Define o campo 'id' para autoincremento, gerando valores automaticamente.
        allowNull: false, // Não permite valores nulos para o campo 'id'.
      },
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
        unique: true
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      birthday_date:{
        type: Sequelize.DATE,
        allowNull: false
      },
      cpf:{
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
      },
      phone:{
        type: Sequelize.STRING,
        allowNull: false
      },
      education: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,  // campo comumente utilizado para armazenar a data e hora em que o registro foi criado na tabela
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,  // campo utilizado para armazenar a data e hora da última atualização do registro na tabela. Sempre que o registro for modificado, esse campo será atualizado automaticamente para refletir a última modificação.
        allowNull: false,
      }
    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('users');

  }
};


     
