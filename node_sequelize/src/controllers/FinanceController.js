const Finance = require('../models/Finance');
const Product = require('../models/Product');
const User = require('../models/User');

const Sequelize = require('sequelize');

const dbConfig = require('../config/database');
const sequelize = new Sequelize(dbConfig);
const moment = require('moment');

const productController = require('./ProductController');

module.exports = {

    // Função de compra 
    async store(req, res) { 
        const { date, value, quantity, expiry_date, product, payment_method } = req.body;
        const { user_id } = req.params;
        const {code} = product;
        const description = "Compra";

        const user = await User.findByPk(user_id);
        const id_empresa = user.id_empresa;
        
        try {
            // Cadastrar o produto primeiro
            const existingProduct = await Product.findOne({
                where: {
                    code,
                    id_empresa
                }
            });

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

            const newProduct = await productController.store(product,quantity,expiry_date, id_empresa);

            // Usar o ID do produto cadastrado para criar a entrada de finanças
            const financeEntry = await Finance.create({date,description,value,product_id: newProduct.product.id,quantity,expiry_date,payment_method, id_empresa});

            return res.status(201).json(financeEntry);
        } catch (error) {
            return res.status(400).send({
                status: 0,
                message: 'Error creating finance entry',
                error: error.message,
            });
        }
    },

    // Função de venda
    async recordSale(req, res) { 
        const { date, payment_method, products, cash_register } = req.body;
        const { user_id } = req.params;
        const description = "Venda";

        try {
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).send({
                    status: 0,
                    message: 'Lista de produtos inválida.',
                });
            }
            for (const product of products) {
                const { code, quantity } = product;
                console.log(code, "  ,  ", quantity);

                if (!code || !quantity) {
                    return res.status(400).send({
                        status: 0,
                        message: 'Dados do produto inválidos.',
                    });
                }

                const user = await User.findByPk(user_id);
                const id_empresa = user.id_empresa;

                const existingProduct = await Product.findOne({
                    where: {
                        code,
                        id_empresa
                    }
                });

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

                console.log(description);
                // Registra a transação financeira
                await Finance.create({
                    date,
                    description,
                    value: existingProduct.sale_price * quantity,
                    product_id: existingProduct.id,
                    payment_method,
                    quantity,
                    cash_register,
                    id_empresa
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

    // Função para a equipe de dados: retorna as datas e o id da empresa para fazer um relatório 
    async show_sales(req, res) {
        try {
            const {cash_register, user_id} = req.params;
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

            const user = await User.findByPk(user_id);
            const id_empresa = user.id_empresa;

            return res.status(200).send({
                status: 1,
                sales_over_date,
                id_empresa
            })

        } catch (err) {
            console.log(err);
            return res.status(500).send({
                status: 0,
                message:"Internal server erro."
            })
        }
    },

    // Função para a equipe de dados: retorna o número do caixa e a data atual para fazer um relatório de venda daquele caixa daquela data
    async closeCashRegister(req, res) {

        const {cash_register, user_id} = req.params;
            
        try {
            // Verifica se o número do caixa foi fornecido
            if (!cash_register) {
                return res.status(400).send({
                    status: 0,
                    message: 'Número do caixa não fornecido!',
                });
            }
    
            // Obtém a data atual usando moment.js
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            // Obtém od id da empresa
            const user = await User.findByPk(user_id);
            const id_empresa = user.id_empresa;
    
            return res.status(200).send({
                status: 1,
                message: 'Fechamento de caixa realizado com sucesso!',
                data: {
                    date: currentDate,
                    cash_register: cash_register,
                    id_empresa
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

    // Função para a equipe de dados: retorna as datas e o tipo de filtragem para fazer um relatório de venda
    async filterByDateRange(req, res) {
        try {
            const { startDate, endDate, filterType } = req.body;
            const {user_id} = req.params;
    
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

            // Obtém od id da empresa
            const user = await User.findByPk(user_id);
            const id_empresa = user.id_empresa;
    
            // Se todas as validações passarem, retorne as datas e o tipo de filtragem
            return res.status(200).send({
                status: 1,
                message: 'Datas e tipo de filtragem recebidos com sucesso!',
                startDate: startDate,
                endDate: endDate,
                filterType: filterType,
                id_empresa
            });
    
        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao processar datas e tipo de filtragem',
                error: error.message,
            });
        }
    },

    // isso é somente para os desenvolvedores:
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
    }
    
};