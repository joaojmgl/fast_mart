const { Model, DataTypes } = require('sequelize');

class Address extends Model {
    static init(sequelize) {
        super.init({
            street: DataTypes.STRING,
            number: DataTypes.STRING,
            district: DataTypes.STRING,
            city: DataTypes.STRING,
            state: DataTypes.STRING,
        }, {
            sequelize
        })
    }
    /*Endereço (rua, número, bairro, cidade, estado, país, complemento)*/
    static associate(models) {
        this.hasOne(models.company, { foreignKey: 'addresses_id', as: 'company' });
    }
}

module.exports = Address;
