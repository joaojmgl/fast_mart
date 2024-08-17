const { Model, DataTypes } = require('sequelize');

class company extends Model {
    static init(sequelize) {
        super.init({
            comp_name: DataTypes.STRING,
            comp_cnpj: DataTypes.STRING,
            comp_employees: DataTypes.STRING,

        }, {
            freezeTableName:true,
            sequelize,
        })
    }

    static associate(models){
        this.belongsTo(models.Address, { foreignKey: 'addresses_id', as: 'address' });
    }
}

module.exports = company;