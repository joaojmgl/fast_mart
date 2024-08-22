'use strict';

module.exports = {
    async up(queryInterface, Sequelize){
        // return Promise.all([
        //     queryInterface.removeColumn('addresses', 'user_id', {})
        //
        //
        // ]);
      },

      async down(queryInterface, Sequelize) {
        // return Promise.all([
        //     queryInterface.addColumn('addresses', 'user_id', {
        //         type: Sequelize.INTEGER,
        //         allowNull: false,
        //         references: {
        //             model: 'users',
        //             key: 'id',
        //         },
        //         onUpdate: 'CASCADE',
        //         onDelete: 'CASCADE',
        //     }),
        // ]);
      }
}
