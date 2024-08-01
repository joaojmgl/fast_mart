const { Model, DataTypes } = require('sequelize');
class Category extends Model {
    static init(sequelize) {
        super.init({
            date: DataTypes.STRING,
            description: DataTypes.STRING,
            values: DataTypes.INTEGER

        }, {
            sequelize,
        })
    }
}

module.exports = Category;