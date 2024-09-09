const { Model, DataTypes } = require('sequelize');

class companies extends Model {
    static init(sequelize) {
        super.init({
            comp_name: DataTypes.STRING,
            comp_cnpj: DataTypes.STRING,
            comp_employees: DataTypes.STRING,

        }, {
            sequelize,
        })
    }

    static associate(models){

    }
}

module.exports = companies;