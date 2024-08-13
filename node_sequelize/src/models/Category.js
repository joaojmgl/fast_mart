const { Model, DataTypes } = require('sequelize');
class Category extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,

        }, {
            sequelize,
        })
    }
}

module.exports = Category;