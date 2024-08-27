const { Model, DataTypes } = require('sequelize');

class DeletedProduct extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      unit_of_measure: DataTypes.STRING,
      purchase_price: DataTypes.FLOAT,
      quantity_per_unit: DataTypes.FLOAT,
      sale_price: DataTypes.FLOAT,
      expiry_date: DataTypes.DATE,
      supplier: DataTypes.STRING,
      code: DataTypes.INTEGER,
      company_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      deleted_at: DataTypes.DATE,
    }, {
      sequelize,
      tableName: 'DeletedProduct',
      timestamps: false, // Desativa as colunas created_at e updated_at
    });
  }
  static associate(models) {
      this.belongsTo(models.companies, { foreignKey: 'company_id', as: 'companies' });
  }
}

module.exports = DeletedProduct;


