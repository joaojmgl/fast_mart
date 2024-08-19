const Finance = require('../models/Finance');
const Product = require('../models/Product');

const Sequelize = require('sequelize');

const dbConfig = require('../config/database');
const sequelize = new Sequelize(dbConfig);
const moment = require('moment');

const productController = require('./ProductController');

module.exports = {
    async store(req, res) {
        const { date, description, value, quantity, expiry_date, product, payment_method } = req.body;
        const {code} = product;
        try {
            // Cadastrar o produto primeiro
            const existingProduct = await Product.findOne({ where: { code } });
            if (existingProduct){
                if(!(existingProduct.name == product.name)){
                    return res.status(400).send({
                        status:1,
                        message:`Nome de produto invalido, codigo ja registrado como ${existingProduct.name}`
                    })
                }
                const data_finance = {date,description,value,quantity,expiry_date,product_id:existingProduct.id,payment_method}
                productController.increaseQuantity(code,quantity,expiry_date)
                const finance_entry = await Finance.create(data_finance)
                return res.status(200).send({
                    status: 0,
                    message: 'Codigo ja existente, produto incrementado.',
                    finance_entry
                });
            }
            const newProduct = await productController.store(product,quantity,expiry_date);

            // Usar o ID do produto cadastrado para criar a entrada de finanças
            const financeEntry = await Finance.create({date,description,value,product_id: newProduct.product.id,quantity,expiry_date,payment_method});

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
        const { date, description, payment_method, products, cash_register } = req.body;

        try {
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).send({
                    status: 0,
                    message: 'Lista de produtos inválida.',
                });
            }
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
                    product_id: existingProduct.id,
                    payment_method,
                    quantity,
                    cash_register
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
    },

    async show_sales(req, res) {
        try {
            const {cash_register} = req.params;
            const {start_date, end_date} = req.body;
            const caixa = await Finance.findOne({where:{cash_register}})
            console.log(cash_register)
            //const venda = await Finance.findAll({where:{cash_register}})
            const sales_over_date = await Finance.findAll({where:{cash_register,createdAt:{[Op.between]:[new Date(start_date),new Date(end_date)]}}})
            if (!caixa) {
                return res.status(404).send({
                    status: 0,
                    message: "Caixa não existe ou não resgistrou venda",
                })
            }
            return res.status(200).send({
                status: 1,
                sales_over_date,
            })

        } catch (err) {
            console.log(err);
            return res.status(500).send({
                status: 0,
                message:"Internal server erro."
            })
        }
    },
    async index(req, res) {
        try {
            const finances = await Finance.findAll();

            return res.status(200).send({
                status: 1,
                message: 'Finanças encontradas com sucesso!',
                finances,
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao buscar Finanças',
                error: error.message,
            });
        }
    },

    async closeCashRegister(req, res) {

        const { registerNumber } = req.body; // Número do caixa 
            
        try {
            // Verifica se o número do caixa foi fornecido
            if (!registerNumber) {
                return res.status(400).send({
                    status: 0,
                    message: 'Número do caixa não fornecido!',
                });
            }
    
            // Obtém a data atual usando moment.js
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    
            return res.status(200).send({
                status: 1,
                message: 'Fechamento de caixa realizado com sucesso!',
                data: {
                    date: currentDate,
                    registerNumber: registerNumber
                }
            });
    
        } catch (err) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao fechar o caixa.',
                error: err.message,
            });
        }
    },

    async filterByDateRange(req, res) {
        try {
            const { startDate, endDate, filterType } = req.body;
    
            // Verifique se ambas as datas e o tipo de filtragem estão presentes
            if (!startDate || !endDate || !filterType) {
                return res.status(400).send({
                    status: 0,
                    message: 'Data de início, data final e tipo de filtragem são obrigatórios.',
                });
            }
    
            // Verifique se as datas são válidas
            const start = new Date(startDate);
            const end = new Date(endDate);
    
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).send({
                    status: 0,
                    message: 'Data de início ou data final inválidas.',
                });
            }
    
            // Verifique se a data de início não é posterior à data de término
            if (start > end) {
                return res.status(400).send({
                    status: 0,
                    message: 'A data de início não pode ser posterior à data de término.',
                });
            }
    
            // Verifique se o tipo de filtragem é válido
            const validFilterTypes = ['fornecedor', 'produto'];
            if (!validFilterTypes.includes(filterType)) {
                return res.status(400).send({
                    status: 0,
                    message: 'Tipo de filtragem inválido. Use "fornecedor" ou "produto".',
                });
            }
    
            // Se todas as validações passarem, retorne as datas e o tipo de filtragem
            return res.status(200).send({
                status: 1,
                message: 'Datas e tipo de filtragem recebidos com sucesso!',
                startDate: startDate,
                endDate: endDate,
                filterType: filterType,
            });
    
        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao processar datas e tipo de filtragem',
                error: error.message,
            });
        }
    }
    
};