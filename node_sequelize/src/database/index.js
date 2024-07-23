const Sequelize = require('sequelize');

const dbConfig = require('../config/database');

const User = require('../models/User');
const Address = require('../models/Address');
const Product = require('../models/Product');

const connection = new Sequelize(dbConfig);

User.init(connection);
Address.init(connection);
Product.init(connection);

Address.associate(connection.models);
User.associate(connection.models);

module.exports = connection;