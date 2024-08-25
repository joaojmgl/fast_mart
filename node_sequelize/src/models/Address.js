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
        // this.hasOne(models.company, { foreignKey: 'addresses_id', as: 'companies' });
        this.belongsTo(models.companies, { foreignKey: 'company_id', as: 'companies' });
    }
}

module.exports = Address;
