'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('finance', 'payment_method', {
            type: Sequelize.ENUM('Cartão de credito','Dinheiro', 'Cartão de débito', 'Pix'),
            allowNull: false, // Altere para true se o campo não for obrigatório
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('finance', 'payment_method');
    }
};