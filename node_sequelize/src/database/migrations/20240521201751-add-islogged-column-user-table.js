'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {

    // Adicionando uma nova coluna à tabela 'users'
    return queryInterface.addColumn(

      'users', // Nome da tabela onde a coluna será adicionada
      'is_logged', // Nome da coluna que será adicionada
      {
        type: Sequelize.BOOLEAN, // Tipo da coluna, neste caso, um valor booleano (true ou false)
        defaultValue: false, // Valor padrão para a coluna, opcional
        allowNull: false // Define se a coluna pode ou não conter valores nulos
      }
    );
  },

  down: (queryInterface, Sequelize) => {

    // Removendo a coluna adicionada anteriormente
    return queryInterface.removeColumn(
      
      'users', // Nome da tabela de onde a coluna será removida
      'is_logged' // Nome da coluna que será removida
    );
  }
};
