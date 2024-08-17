'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('finance', 'product_id', {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products', // Nome da tabela referenciada
                    key: 'id', // Chave referenciada
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            }),
            queryInterface.addColumn('finance', 'quantity', {
                type: Sequelize.FLOAT,
                allowNull: false,
            }),
            queryInterface.addColumn('finance', 'expiry_date', {
                type: Sequelize.DATE,
                allowNull: true, // Permitir nulo se a data de validade não for obrigatória
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('finance', 'product_id'),
            queryInterface.removeColumn('finance', 'quantity'),
            queryInterface.removeColumn('finance', 'expiry_date'),
        ]);
    }
};
