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
    async store(productData,quantity,expiryDate,res,req) {
        try {
            const { name, unit_of_measure, purchase_price,sale_price, supplier, code } = productData;
            // Verifique se o produto com o mesmo código já existe
            // const existingProduct = await Product.findOne({ where: { code } });
            // if (existingProduct) {
            //     return res.status(400).send({
            //         status: 0,
            //         message: 'Código de produto já cadastrado.',
            //     });
            // }

            // Crie o novo produto
            const product = await Product.create({ name, unit_of_measure, purchase_price, quantity_per_unit : quantity, sale_price, expiry_date: expiryDate, supplier, code });
            const token = generateToken({ id: product.id });

            // return res.status(200).send({
            //     status: 1,
            //     message: 'Produto cadastrado com sucesso!',
            //     product,
            //     token
            // });
            return { status: 200, message: 'Produto cadastrado com sucesso!', product, token };

        } catch (error) {
            // return res.status(500).send({
            //     status: 0,
            //     message: 'Erro ao cadastrar produto',
            //     error: error.message,
            // });
            return { status: 500, message: 'Erro ao cadastrar produto', error: error.message };
        }
    },

    // Função para deletar um produto
    async delete(req, res) {
        try {
          const { code } = req.params;
          console.log("Código recebido:", code);
      
          // Verifique se o código do produto é válido
          if (!code) {
            return res.status(400).send({
              status: 0,
              message: 'Código do produto é obrigatório.',
            });
          }
          
          // Encontre o produto pelo código
          const product = await Product.findOne({ where: { code } });
          console.log("Produto encontrado:", product);
            console.log("Dados para DeletedProduct:", {
            name: product.name,
            unit_of_measure: product.unit_of_measure,
            purchase_price: product.purchase_price,
            quantity_per_unit: product.quantity_per_unit,
            sale_price: product.sale_price,
            expiry_date: product.expiry_date,
            supplier: product.supplier,
            code: product.code,
            deleted_at: new Date(),
 
          });

      
          if (!product) {
            return res.status(404).send({
              status: 0,
              message: 'Produto não encontrado.',
            });
          }
      
          // Copie os dados para a tabela DeletedProducts
          await DeletedProduct.create({
            name: product.name,
            unit_of_measure: product.unit_of_measure,
            purchase_price: product.purchase_price,
            quantity_per_unit: product.quantity_per_unit,
            sale_price: product.sale_price,
            expiry_date: product.expiry_date,
            supplier: product.supplier,
            code: product.code,
            deleted_at: new Date()
        });
    
          
          // Deletar o produto da tabela original
          //await product.destroy({ where: { code: code } });
          await Product.destroy({ where: { code } });

        //   await User.destroy({ where: { id: user_id } });
      
          return res.status(200).send({
            status: 1,
            message: 'Produto deletado com sucesso!',
          });
      
        } catch (error) {
          console.error("Erro ao deletar produto:", error);
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

    async decreaseQuantity(req) {
        try {
            const { code, quantity } = req.body;

            if (!quantity || quantity <= 0) {
                return {
                    status: 0,
                    message: 'Quantidade deve ser um valor positivo.',
                };
            }

            const product = await Product.findOne({ where: { code } });

            if (!product) {
                return {
                    status: 0,
                    message: 'Produto não encontrado.',
                };
            }

            if (product.quantity_per_unit < quantity) {
                return {
                    status: 0,
                    message: 'Quantidade insuficiente em estoque.',
                };
            }
            product.quantity_per_unit -= parseFloat(quantity);
            await product.save();

            return {
                status: 1,
                message: 'Quantidade de produto diminuída com sucesso!',
                product,
            };
        } catch (error) {
            return {
                status: 0,
                message: 'Erro ao diminuir quantidade de produto',
                error: error.message,
            };
        }
    },


    // Função para aumentar a quantidade de um produto
    // A quantidade digitada será adionada a quantidade atual no estoque
    async increaseQuantity(code,quantity,res) {
        try {
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
            console.log("entrei")

        } catch (error) {
            // return res.status(500).send({
            //     status: 0,
            //     message: 'Erro ao aumentar quantidade de produto',
            //     error: error.message,
            // });
        }
    },

    async searchByName(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).send({
                    status: 0,
                    message: 'Nome do produto é obrigatório.',
                });
            }

            // Pesquisar o produto pelo nome
            const product = await Product.findOne({ where: { name } });

            if (!product) {
                return res.status(404).send({
                    status: 0,
                    message: 'Produto não encontrado.',
                });
            }

            return res.status(200).send({
                status: 1,
                message: 'Produto encontrado com sucesso!',
                product,
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao buscar produto',
                error: error.message,
            });
        }
    },

    async checkDateRange(req, res) {
        try {
            const { startDate, endDate } = req.body;
    
            // Verifique se ambas as datas estão presentes
            if (!startDate || !endDate) {
                return res.status(400).send({
                    status: 0,
                    message: 'Data de início e data final são obrigatórias.',
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
    
            // Se todas as validações passarem, retorne as datas
            return res.status(200).send({
                status: 1,
                message: 'Datas recebidas com sucesso!',
                startDate: startDate,
                endDate: endDate,
            });
    
        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao processar datas',
                error: error.message,
            });
        }
    },

    async getExpiringProducts(req, res) {
        try {
            const { days } = req.body;
    
            // Verifique se o número de dias está presente e é um valor positivo
            if (!days || days <= 0) {
                return res.status(400).send({
                    status: 0,
                    message: 'Número de dias deve ser um valor positivo.',
                });
            }
    
            // Calcule a data limite para expiração
            const today = new Date();
            const expiryLimit = new Date(today);
            expiryLimit.setDate(today.getDate() + parseInt(days));
    
            // Encontre os produtos que vão vencer dentro do intervalo de dias
            const products = await Product.findAll({
                where: {
                    expiry_date: {
                        [Sequelize.Op.between]: [today, expiryLimit]
                    }
                }
            });
    
            if (products.length === 0) {
                return res.status(200).send({
                    status: 1,
                    message: 'Nenhum produto vai vencer dentro do período especificado.',
                    days
                });
            }
    
            // Retorne os produtos encontrados e a data de expiração
            return res.status(200).send({
                status: 1,
                message: 'Produtos que vão vencer encontrados com sucesso!',
                products: products.map(product => ({
                    name: product.name,
                    expiry_date: product.expiry_date,
                    days_until_expiry: Math.ceil((product.expiry_date - today) / (1000 * 60 * 60 * 24))
                })),
                days
            });
    
        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao buscar produtos que vão vencer',
                error: error.message,
            });
        }
    }

};







