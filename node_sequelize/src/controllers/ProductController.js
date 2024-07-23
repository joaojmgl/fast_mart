const Product = require('../models/Product');

const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');


const dbConfig = require('../config/database');
const sequelize = new Sequelize(dbConfig);

const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 78300,
    });
}

module.exports = {
    // Função para cadastrar um novo produto
    async store(req, res) {
        try {
            const { name, unit_of_measure, purchase_price, quantity_per_unit, sale_price, expiry_date, supplier, code } = req.body;
            // Verifique se o produto com o mesmo código já existe
            const existingProduct = await Product.findOne({ where: { code } });

            if (existingProduct) {
                return res.status(400).send({
                    status: 0,
                    message: 'Código de produto já cadastrado.',
                });
            }

            // Crie o novo produto
            const product = await Product.create({ name, unit_of_measure, purchase_price, quantity_per_unit, sale_price, expiry_date, supplier, code });

            const token = generateToken({ id: product.id });

            return res.status(200).send({
                status: 1,
                message: 'Produto cadastrado com sucesso!',
                product,
                token
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao cadastrar produto',
                error: error.message,
            });
        }
    },

    // Função para deletar um produto
    async delete(req, res) {
        try {
            const { code } = req.params;

            const product = await Product.findOne({ where: { code } });

            if (!product) {
                return res.status(404).send({
                    status: 0,
                    message: 'Produto não encontrado.',
                });
            }

            await product.destroy();

            return res.status(200).send({
                status: 1,
                message: 'Produto deletado com sucesso!',
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao deletar produto',
                error: error.message,
            });
        }
    },

    // Função para atualizar um produto
    async update(req, res) {
        try {

            const { code } = req.params;
            const { name, unit_of_measure, purchase_price, quantity_per_unit, sale_price, expiry_date, supplier } = req.body;

            const product = await Product.findOne({ where: { code } });

            if (!product) {
                return res.status(404).send({
                    status: 0,
                    message: 'Produto não encontrado.',
                });
            }

            await product.update({ name, unit_of_measure, purchase_price, quantity_per_unit, sale_price, expiry_date, supplier, code });

            return res.status(200).send({
                status: 1,
                message: 'Produto atualizado com sucesso!',
                product,
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao atualizar produto',
                error: error.message,
            });
        }
    },
    
    // Função para ver todos os produtos
    async index(req, res) {
        try {
            const products = await Product.findAll();

            return res.status(200).send({
                status: 1,
                message: 'Produtos encontrados com sucesso!',
                products,
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao buscar produtos',
                error: error.message,
            });
        }
    },

    
    // Função para diminuir a quantidade de um produto
    // A quantidade digitada será retirada da quantidade atual no estoque, se possível
    async decreaseQuantity(req, res) {
        try {
            const { code } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity <= 0) {
                return res.status(400).send({
                    status: 0,
                    message: 'Quantidade deve ser um valor positivo.',
                });
            }

            const product = await Product.findOne({ where: { code } });

            if (!product) {
                return res.status(404).send({
                    status: 0,
                    message: 'Produto não encontrado.',
                });
            }

            if (product.quantity_per_unit < quantity) {
                return res.status(409).send({
                    status: 0,
                    message: 'Quantidade insuficiente em estoque.',
                });
            }

            product.quantity_per_unit -= parseFloat(quantity);
            await product.save();

            return res.status(200).send({
                status: 1,
                message: 'Quantidade de produto diminuída com sucesso!',
                product,
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao diminuir quantidade de produto',
                error: error.message,
            });
        }
    },

    // Função para aumentar a quantidade de um produto
    // A quantidade digitada será adionada a quantidade atual no estoque
    async increaseQuantity(req, res) {
        try {
            const { code } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity <= 0) {
                return res.status(400).send({
                    status: 0,
                    message: 'Quantidade deve ser um valor positivo.',
                });
            }

            const product = await Product.findOne({ where: { code } });

            if (!product) {
                return res.status(404).send({
                    status: 0,
                    message: 'Produto não encontrado.',
                });
            }

            product.quantity_per_unit += parseFloat(quantity);
            await product.save();

            return res.status(200).send({
                status: 1,
                message: 'Quantidade de produto aumentada com sucesso!',
                product,
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao aumentar quantidade de produto',
                error: error.message,
            });
        }
    }
};







