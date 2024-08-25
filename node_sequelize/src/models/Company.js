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
        // this.hasMany(models.Address, { foreignKey: 'company_id', as: 'address' });
        // this.hasMany(models.DeletedProducts, { foreignKey: 'company_id', as: 'DeletedProducts' });
        // this.hasMany(models.Finance, { foreignKey: 'company_id', as: 'Finance' });
        // this.hasMany(models.Product, { foreignKey: 'company_id', as: 'Product' });
        // this.hasMany(models.User, { foreignKey: 'company_id', as: 'User' });
    }
}

module.exports = companies;