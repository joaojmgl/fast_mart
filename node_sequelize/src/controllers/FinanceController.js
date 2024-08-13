const Finance = require('../models/Finance');
const Product = require('../models/Product');

const Sequelize = require('sequelize');

const dbConfig = require('../config/database');
const sequelize = new Sequelize(dbConfig);

const productController = require('./ProductController');

module.exports = {
    async store(req, res) {
        const { date, description, value, quantity, expiry_date, product, payment_method } = req.body;

        try {
            // Cadastrar o produto primeiro
            const newProduct = await Product.create(product);

            productController.store(newProduct);
            
            console.log(newProduct.code);

            // Usar o ID do produto cadastrado para criar a entrada de finanças
            const financeEntry = await Finance.create({
                date,
                description,
                value,
                product_id: newProduct.code,
                quantity,
                expiry_date,
                payment_method
            });

            return res.status(201).json(financeEntry);
        } catch (error) {
            return res.status(400).send({
                status: 0,
                message: 'Error creating finance entry',
                error: error.message,
            });
        }
    },

    // async recordSale(req, res) {
    //     const { date, description, payment_method, products } = req.body;
    
    //     try {
    //         if (!Array.isArray(products) || products.length === 0) {
    //             return res.status(400).send({
    //                 status: 0,
    //                 message: 'Lista de produtos inválida.',
    //             });
    //         }
    
    //         // Itera sobre os produtos para processar cada um
    //         for (const product of products) {
    //             const { code, quantity, unit_price } = product;
                
    //             console.log(product);
    //             if (!code || !quantity || !unit_price) {
    //                 return res.status(400).send({
    //                     status: 0,
    //                     message: 'Dados do produto inválidos.',
    //                 });
    //             }
    
    //             // Verifica se o produto existe
    //             const existingProduct = await Product.findByPk(code);
    
    //             if (!existingProduct) {
    //                 return res.status(404).send({
    //                     status: 0,
    //                     message: `Produto com ID ${code} não encontrado.`,
    //                 });
    //             }

    //             // Diminui a quantidade do produto no estoque
    //             // await productController.decreaseQuantity({ params: { code: existingProduct.code }, body: { quantity } });
    //             await productController.decreaseQuantity(
    //                 { body: { code: existingProduct.code, quantity } },
    //                 res
    //             );

    //             // Registra a transação financeira
    //             await Finance.create({
    //                 date,
    //                 description,
    //                 value: unit_price * quantity, // Total da venda para o produto
    //                 product_id: code,
    //                 payment_method,
    //                 quantity,
    //             });
    //         }
    
    //         return res.status(201).send({
    //             status: 1,
    //             message: 'Venda registrada com sucesso!',
    //         });
    //     } catch (error) {
    //         return res.status(500).send({
    //             status: 0,
    //             message: 'Erro ao registrar a venda',
    //             error: error.message,
    //         });
    //     }
    // }    

    async recordSale(req, res) {
        const { date, description, payment_method, products } = req.body;
    
        try {
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).send({
                    status: 0,
                    message: 'Lista de produtos inválida.',
                });
            }
            
            console.log(payment_method);

            for (const product of products) {
                const { code, quantity } = product;
    
                if (!code || !quantity) {
                    return res.status(400).send({
                        status: 0,
                        message: 'Dados do produto inválidos.',
                    });
                }
    
                const existingProduct = await Product.findOne({ where: { code } });
    
                if (!existingProduct) {
                    return res.status(404).send({
                        status: 0,
                        message: `Produto com ID ${code} não encontrado.`,
                    });
                }

                // Chama a função decreaseQuantity e captura o resultado
                const result = await productController.decreaseQuantity({
                    body: { code: existingProduct.code, quantity }
                });
    
                if (result.status === 0) {
                    return res.status(400).send(result);
                }
    
                // Registra a transação financeira
                await Finance.create({
                    date,
                    description,
                    value: existingProduct.sale_price * quantity,
                    product_id: code,
                    payment_method,
                    quantity,
                });
            }
    
            return res.status(201).send({
                status: 1,
                message: 'Venda registrada com sucesso!',
            });
        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao registrar a venda',
                error: error.message,
            });
        }
    }
    
    
};