'use strict';



module.exports = {
    up:(queryInterface, Sequelize) =>{
        return queryInterface.createTable('finance',{
            id:{
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            date:{
                type: Sequelize.DATE,
                allowNull: false,
            },
            description:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            value:{
                type: Sequelize.INTEGER,
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
        return queryInterface.dropTable('finance');
    }
};