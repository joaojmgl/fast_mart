const Sequelize = require('sequelize');

const dbConfig = require('../config/database');

const User = require('../models/User');
const Address = require('../models/Address');
const Company = require('../models/Company');
const Finance = require('../models/Finance');
const Product = require('../models/Product');
const Category = require('../models/Category');

const connection = new Sequelize(dbConfig);

User.init(connection);
Address.init(connection);
Company.init(connection);
Finance.init(connection);
Product.init(connection);
Category.init(connection);

Product.associate(connection.models)
Address.associate(connection.models);
User.associate(connection.models);
module.exports = connection;