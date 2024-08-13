const { Model, DataTypes } = require('sequelize');

class Finance extends Model {
    static init(sequelize) {
        super.init({
            date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            value: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                }
            },
            quantity: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            expiry_date: {
                type: DataTypes.DATE,
                allowNull: true // Permitir nulo se a data de validade não for obrigatória
            },
            payment_method: {
                type: DataTypes.ENUM('Cartão de credito', 'Dinheiro', 'Cartão de débito', 'Pix'),
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'finance'
        });
    }

    static associate(models) {
        this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
}

module.exports = Finance;
