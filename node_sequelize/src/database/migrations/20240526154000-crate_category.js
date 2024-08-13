'use strict';



module.exports = {
    up:(queryInterface, Sequelize) =>{
        return queryInterface.createTable('category',{
            id:{
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            description:{// Uma tabela sobre as unidades de peso
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

        })
    },
    down: (queryInterface, sequelize) =>{
        return queryInterface.dropTable('category');
    }

};