const { Model, DataTypes } = require('sequelize');

class Product extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,  // nome - leite
            unit_of_measure: DataTypes.STRING,  // unidade de medida - litro
            purchase_price: DataTypes.FLOAT, // preço de compra por unidade de medida - 3
            quantity_per_unit: DataTypes.FLOAT, // quantidade por unidade de medida - 2   (então foi gasto 2*3 = 6 reais)
            sale_price: DataTypes.FLOAT,  // preço de venda do produto em questão - 8
            expiry_date: DataTypes.DATE,  // data de validade - 20/05/2025
            supplier: DataTypes.STRING, // fornecedor - danone
            code: DataTypes.INTEGER  // código - 0526

        }, {
            sequelize,
        });
    }

    static associate(models) {

        this.belongsTo(models.companies, { foreignKey: 'company_id', as: 'companies' });

    }
}

module.exports = Product;
