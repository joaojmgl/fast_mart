const { Model, DataTypes } = require('sequelize');
class company extends Model {
    static init(sequelize) {
        super.init({
            comp_name: DataTypes.STRING,
            comp_cnpj: DataTypes.STRING,
            comp_employees: DataTypes.STRING,
            comp_address: DataTypes.STRING,

        }, {
            freezeTableName:true,
            sequelize,
        })
    }

    static associate(model){
        // this.hasOne(models.Finance,{foreignKey:'finance_id', as:'finance'})
    }
}

module.exports = company;