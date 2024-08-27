const Finance = require('../models/Finance');
const Product = require('../models/Product');
const User = require('../models/User');
const { Op } = require('sequelize'); // Importar Op do Sequelize

const Sequelize = require('sequelize');

const dbConfig = require('../config/database');
const sequelize = new Sequelize(dbConfig);
const moment = require('moment');

const productController = require('./ProductController');

module.exports = {

    // Função de compra  

    async store(req, res) {
        const { date, value, quantity, expiry_date, product, payment_method } = req.body;
        const { company_id } = req.params;
        const { code } = product;
        const description = "Compra";

        if (!company_id) {
            return res.status(400).send({
                status: 1,
                message: 'ID da empresa não fornecido.'
            });
        }

        // console.log("Product recebido:", product);

        try {
            // Cadastrar o produto primeiro
            const existingProduct = await Product.findOne({
                where: {
                    company_id,
                    code
                }
            });
            // console.log("Product recebido:", product);
            if (existingProduct) {
                if (existingProduct.name !== product.name) {
                    return res.status(400).send({
                        status: 1,
                        message: `Nome de produto inválido, código já registrado como ${existingProduct.name}`
                    });
                }

                const data_finance = {
                    date,
                    description,
                    value,
                    quantity,
                    expiry_date,
                    product_id: existingProduct.id,
                    payment_method,
                    company_id
                };

                await productController.increaseQuantity(req,res,code,quantity,company_id);
                const finance_entry = await Finance.create(data_finance);

                return res.status(200).send({
                    status: 0,
                    message: 'Código já existente, produto incrementado.',
                    finance_entry
                });
            }

            const newProduct = await productController.store(product, quantity, expiry_date, company_id);
            // Usar o ID do produto cadastrado para criar a entrada de finanças
            const financeEntry = await Finance.create({
                date,
                description,
                value,
                product_id: newProduct.product.id,
                quantity,
                expiry_date,
                payment_method,
                company_id
            });
            return res.status(201).json(financeEntry);
        } catch (error) {
            console.error(error); // Log para depuração
            return res.status(500).send({
                status: 0,
                message: 'Erro ao criar entrada financeira',
                error: error.message
            });
        }
    },

    // Função de venda
    async recordSale(req, res) { 
        const { date, payment_method, products, cash_register } = req.body;
        // const { user_id } = req.params;
        const {company_id} = req.params;
        const description = "Venda";
        console.log(cash_register);
        try {
            console.log(cash_register);
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

                //const user = await User.findByPk(user_id);
               // const id_empresa = user.id_empresa;

                const existingProduct = await Product.findOne({
                    where: {
                        code,
                        company_id
                    }
                });

                if (!existingProduct) {
                    return res.staidtus(404).send({
                        status: 0,
                        message: `Produto com ID ${code} não encontrado.`,
                    });
                }
                // Chama a função decreaseQuantity e captura o resultado

                const result = await productController.decreaseQuantity({
                    body: { code: existingProduct.code, quantity, company_id }
                });
                if (result.status === 0) {
                    return res.status(400).send(result);
                }

                console.log(description);
                console.log(cash_register);
                // Registra a transação financeira
                const sale = await Finance.create({
                    date,
                    description,
                    value: existingProduct.sale_price * quantity,
                    product_id: existingProduct.id,
                    payment_method,
                    quantity,
                    cash_register,
                    company_id,
                });
    
                lastSaleId = sale.id; // O ID da venda criada é armazenado diretamente
            }
    
            return res.status(201).send({
                status: 1,
                message: `Venda registrada com sucesso! ID da venda: ${lastSaleId}`, // Retorna o ID da última venda
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
            const {cash_register} = req.params;
            const {start_date, end_date} = req.body;
            const{company_id} = req.params;
            
            const caixa = await Finance.findOne({where:{cash_register}})
            console.log(cash_register)
            //const venda = await Finance.findAll({where:{cash_register}})
            const sales_over_date = await Finance.findAll({where:{cash_register,company_id, createdAt:{[Op.between]:[new Date(start_date),new Date(end_date)]}}})
            if (!caixa) {
                return res.status(404).send({
                    status: 0,
                    message: "Caixa não existe ou não resgistrou venda",
                })
            }


            return res.status(200).send({
                status: 1,
                sales_over_date,
                company_id
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

        const { cash_register } = req.body;
        const { company_id } = req.params;
    
        try {
            // Verifica se o número do caixa foi fornecido
            if (!cash_register) {
                return res.status(400).send({
                    status: 0,
                    message: 'Número do caixa não fornecido!',
                });
            }
    
            // Consulta todas as vendas do caixa especificado para a empresa
            const sales = await Finance.findAll({
                where: {
                    cash_register: cash_register,
                    company_id: company_id,
                }
            });
    
            // Verifica se há vendas para o caixa fornecido
            if (sales.length === 0) {
                return res.status(404).send({
                    status: 0,
                    message: 'Nenhuma venda encontrada para o caixa especificado.',
                });
            }
    
            return res.status(200).send({
                status: 1,
                message: 'Vendas encontradas com sucesso!',
                data: sales
            });
    
        } catch (err) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao listar as vendas do caixa.',
                error: err.message,
            });
        }
    },

    // Função para a equipe de dados: retorna as datas e o tipo de filtragem para fazer um relatório de venda
    async filterByDateRange(req, res) {
        try {
            const { startDate, endDate, filterType } = req.body;
            const { company_id } = req.params;
    
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
    
            // Consulta ao banco de dados com base no tipo de filtragem, intervalo de datas e empresa
            let results;
            if (filterType === 'fornecedor') {
                results = await Supplier.findAll({
                    where: {
                        company_id,
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    }
                });
            } else if (filterType === 'produto') {
                results = await Product.findAll({
                    where: {
                        company_id,
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    }
                });
            }
    
            // Verifica se há resultados
            if (!results || results.length === 0) {
                return res.status(404).send({
                    status: 0,
                    message: 'Nenhum registro encontrado para o intervalo de datas especificado.',
                });
            }
    
            // Retorna os resultados
            return res.status(200).send({
                status: 1,
                message: 'Registros encontrados com sucesso!',
                data: results
            });
    
        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao processar datas e tipo de filtragem',
                error: error.message,
            });
        }
    },

    // isso é somente para os desenvolvedores: retorna todas as finanças de uma empresa

    async index(req, res) {
        const {company_id} = req.params;
        try {
            const finances = await Finance.findAll({
                where: {
                    company_id
                }
            });

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

    // Função para cancelar uma venda
    async cancelSale(req, res) {
        const { saleId } = req.body; // ID da venda a ser cancelada
        const { company_id } = req.params; // ID da empresa do parâmetro

        try {
            // Encontre o registro financeiro com o ID fornecido e o company_id
            const financeRecord = await Finance.findOne({
                where: {
                    id: saleId,
                    company_id: company_id
                }
            });
    
            // console.log('financeRecord:', financeRecord); // Verifique se o registro foi encontrado
    
            if (!financeRecord) {
                return res.status(404).json({ message: 'Registro de venda não encontrado' });
            }
    
            // Verifique se a transação é do tipo 'Venda'
            if (financeRecord.description !== 'Venda') {
                return res.status(400).json({ message: 'Apenas vendas podem ser canceladas' });
            }
    
            // Obtenha o code do produto e a quantidade para reverter a operação
            const { product_id, quantity } = financeRecord;
            const {code} = await Product.findOne({where:{id:product_id}})
            // Exclua o registro financeiro da venda
            await Finance.destroy({ where: { id: saleId } });

            // Aumente a quantidade do produto de volta no estoque
            console.log(quantity)
            console.log(code)
            const result = await productController.increaseQuantity(req,res,code,quantity,company_id);
            // console.log('increaseQuantity result:', result); // Verifique o resultado da função increaseQuantity
    
            // Verifique se a resposta da função increaseQuantity tem status 1
            if (result[1] === 0) {
                return res.status(400).json(result[2]);
            }
    
            return res.json({
                message: 'Venda excluída e quantidade de produto aumentada com sucesso',
                saleId,
                company_id,
                product: result.product,
            });
        } catch (error) {
            console.error('Erro ao cancelar a venda:', error);
            return res.status(500).json({ message: `Erro ao cancelar a venda: ${error.message}` });
        }
    }
    
    
    


    
};