const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    static init(sequelize) {
        super.init({

            name: DataTypes.STRING,
            password: DataTypes.STRING,
            email: DataTypes.STRING,
            code: DataTypes.INTEGER,
            birthday_date: DataTypes.DATE,
            cpf: DataTypes.STRING,
            phone: DataTypes.STRING,
            education: DataTypes.STRING,
            is_logged: DataTypes.BOOLEAN,

        }, {
            sequelize,
            hooks: {
                beforeCreate: (user) => {
                    const salt = bcrypt.genSaltSync();
                    user.password = bcrypt.hashSync(user.password, salt);
                },
            },
        })
    }

    static associate(models) {
        this.hasMany(models.Address, { foreignKey: 'user_id', as: 'address' });
        this.hasOne(models.company, { foreignKey: 'company_id', as: 'company' });
    }

}

module.exports = User;