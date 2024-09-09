const Product = require("../models/Product");
const DeletedProduct = require("../models/DeletedProduct");
const User = require("../models/User");
const Company = require("../models/Company");

const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

const dbConfig = require("../config/database");
const sequelize = new Sequelize(dbConfig);

const jwt = require("jsonwebtoken");

const authConfig = require("../config/auth");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 78300,
  });
}

module.exports = {
  // Função para cadastrar um novo produto
  async store(product, quantity, expiryDate, company_id) {
    try {
      const {
        name,
        unit_of_measure,
        purchase_price,
        sale_price,
        supplier,
        code,
      } = product;

      // Crie o novo produto
      const newProduct = await Product.create({
        name,
        unit_of_measure,
        purchase_price,
        quantity_per_unit: quantity,
        sale_price,
        expiry_date: expiryDate,
        supplier,
        code,
        company_id,
      });

      return {
        status: 200,
        message: "Produto cadastrado com sucesso!",
        product: newProduct,
      };
    } catch (error) {
      console.error(error); // Log para depuração
      return {
        status: 500,
        message: "Erro ao cadastrar produto",
        error: error.message,
      };
    }
  },

  // Função para deletar um produto
  async delete(req, res) {
    try {
      const { code, company_id } = req.params;
      const { description = "" } = req.body;

      // Verificar se o código do produto é válido
      if (!code) {
        return res.status(400).send({
          status: 0,
          message: "Código do produto é obrigatório.",
        });
      }

      const product = await Product.findOne({
        where: {
          code,
          company_id,
        },
      });

      if (!product) {
        return res.status(404).send({
          status: 0,
          message: "Produto não encontrado.",
        });
      }

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

      // Copiar os dados para a tabela DeletedProducts
      await DeletedProduct.create({
        name: product.name,
        unit_of_measure: product.unit_of_measure,
        purchase_price: product.purchase_price,
        quantity_per_unit: product.quantity_per_unit,
        sale_price: product.sale_price,
        expiry_date: product.expiry_date,
        supplier: product.supplier,
        code: product.code,
        company_id: company_id,
        description: description,
        deleted_at: new Date(),
      });

      // Deletar o produto da tabela original
      await Product.destroy({
        where: {
          code,
          company_id,
        },
      });

      return res.status(200).send({
        status: 1,
        message: "Produto deletado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return res.status(500).send({
        status: 0,
        message: "Erro ao deletar produto",
        error: error.message,
      });
    }
  },
  // Função para atualizar um produto
  async update(req, res) {
    try {
      const { code, company_id } = req.params;
      const {
        name,
        unit_of_measure,
        purchase_price,
        quantity_per_unit,
        sale_price,
        expiry_date,
        supplier,
      } = req.body;

      const product = await Product.findOne({
        where: {
          code,
          company_id,
        },
      });

      if (!product) {
        return res.status(404).send({
          status: 0,
          message: "Produto não encontrado.",
        });
      }
      await product.update({
        name,
        unit_of_measure,
        purchase_price,
        quantity_per_unit,
        sale_price,
        expiry_date,
        supplier,
        code,
      });

      return res.status(200).send({
        status: 1,
        message: "Produto atualizado com sucesso!",
        product,
      });
    } catch (error) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao atualizar produto",
        error: error.message,
      });
    }
  },

  // Função para ver todos os produtos
  async index(req, res) {
    try {
      const { company_id } = req.params;

      // Verificar se a empresa com o company_id existe
      const company = await Company.findByPk(company_id);

      if (!company) {
        return res.status(404).send({
          status: 0,
          message: "Empresa não encontrada.",
        });
      }

      // Buscar todos os produtos associados à empresa
      const products = await Product.findAll({
        where: {
          company_id,
        },
      });

      if (!products || products.length === 0) {
        return res.status(404).send({
          status: 0,
          message: "Nenhum produto cadastrado.",
        });
      }

      return res.status(200).send({
        status: 1,
        message: "Produtos encontrados com sucesso!",
        products,
      });
    } catch (error) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao buscar produtos",
        error: error.message,
      });
    }
  },

  // Função para decrementar um produto
  async decreaseQuantity(req) {
    try {
      const { code, quantity, company_id } = req.body;

      if (!quantity || quantity <= 0) {
        return {
          status: 0,
          message: "Quantidade deve ser um valor positivo.",
        };
      }

      const product = await Product.findOne({
        where: {
          code,
          company_id,
        },
      });

      if (!product) {
        return {
          status: 0,
          message: "Produto não encontrado.",
        };
      }

      if (product.quantity_per_unit < quantity) {
        return {
          status: 0,
          message: "Quantidade insuficiente em estoque.",
        };
      }
      product.quantity_per_unit -= parseFloat(quantity);
      await product.save();

      return {
        status: 1,
        message: "Quantidade de produto diminuída com sucesso!",
        product,
      };
    } catch (error) {
      return {
        status: 0,
        message: "Erro ao diminuir quantidade de produto",
        error: error.message,
      };
    }
  },

  async deleteQuantity(req, res) {
    try {
      const { quantity, description } = req.body;
      const { code, company_id } = req.params;

      // Verificar se a quantidade é válida
      if (!quantity || quantity <= 0) {
        return res.status(400).send({
          status: 0,
          message: "Quantidade deve ser um valor positivo.",
        });
      }

      // Buscar o produto pelo código e ID da empresa
      const product = await Product.findOne({
        where: {
          code,
          company_id,
        },
      });

      // Verificar se o produto foi encontrado
      if (!product) {
        return res.status(404).send({
          status: 0,
          message: "Produto não encontrado.",
        });
      }

      // Verificar se há quantidade suficiente em estoque
      if (product.quantity_per_unit < quantity) {
        return res.status(400).send({
          status: 0,
          message: "Quantidade insuficiente em estoque.",
        });
      }

      // Decrementar a quantidade do produto
      product.quantity_per_unit -= parseFloat(quantity);
      await product.save();

      // Opcional: registrar a operação de remoção em uma tabela de histórico, se necessário
      await DeletedProduct.create({
        name: product.name,
        unit_of_measure: product.unit_of_measure,
        purchase_price: product.purchase_price,
        quantity_per_unit: quantity, // quantidade removida
        sale_price: product.sale_price,
        expiry_date: product.expiry_date,
        supplier: product.supplier,
        code: product.code,
        company_id: company_id,
        description: description,
        deleted_at: new Date(),
      });

      return res.status(200).send({
        status: 1,
        message: "Quantidade de produto decrementada com sucesso!",
        product,
      });
    } catch (error) {
      console.error("Erro ao deletar quantidade do produto:", error);
      return res.status(500).send({
        status: 0,
        message: "Erro ao deletar quantidade do produto",
        error: error.message,
      });
    }
  },

  // Função para aumentar a quantidade de um produto
  // A quantidade digitada será adionada a quantidade atual no estoque
  async increaseQuantity(req, res, code, quantity, company_id) {
    try {
      // Verifique se a quantidade é válida
      if (!quantity || isNaN(quantity) || quantity <= 0) {
        return [0, "Quantidade deve ser um valor positivo."];
      }

      // Encontre o produto usando o código e o ID da empresa
      const product = await Product.findOne({
        where: {
          code,
          company_id,
        },
      });

      // Verifique se o produto foi encontrado
      if (!product) {
        return [0, "Produto não encontrado."];
      }

      // Aumente a quantidade do produto
      product.quantity_per_unit += parseFloat(quantity);
      // Salve as alterações no banco de dados
      await product.save();

      return [0, "Quantidade de produto aumentada com sucesso!"];
    } catch (error) {
      console.error("Erro ao aumentar a quantidade do produto:", error);
      return 0;
      // message: 'Erro ao aumentar a quantidade de produto',
      // error: error.message,
    }
  },

  // Função para pesquisar um produto pelo nome
  async searchByName(req, res) {
    try {
      const { name } = req.body;
      const { company_id } = req.params;

      if (!name) {
        return res.status(400).send({
          status: 0,
          message: "Nome do produto é obrigatório.",
        });
      }

      // Buscar todos os produtos que correspondem ao nome e company_id
      const products = await Product.findAll({
        where: {
          name,
          company_id,
        },
      });

      if (products.length === 0) {
        return res.status(404).send({
          status: 0,
          message: "Produto(s) não encontrado(s).",
        });
      }

      return res.status(200).send({
        status: 1,
        message: "Produto(s) encontrado(s) com sucesso!",
        products,
      });
    } catch (error) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao buscar produto(s)",
        error: error.message,
      });
    }
  },

  // Função para a equipe de dados: retorna a data inicial, data final e o company_id para filtragem dos produtos mais vendidos
  async checkDateRange(req, res) {
    try {
      const { startDate, endDate } = req.body;
      const { company_id } = req.params;

      // Verifique se ambas as datas estão presentes
      if (!startDate || !endDate) {
        return res.status(400).send({
          status: 0,
          message: "Data de início e data final são obrigatórias.",
        });
      }

      // Verifique se as datas são válidas
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).send({
          status: 0,
          message: "Data de início ou data final inválidas.",
        });
      }

      // Verifique se a data de início não é posterior à data de término
      if (start > end) {
        return res.status(400).send({
          status: 0,
          message: "A data de início não pode ser posterior à data de término.",
        });
      }

      // Se todas as validações passarem, retorne as datas
      return res.status(200).send({
        status: 1,
        message: "Datas recebidas com sucesso!",
        startDate: startDate,
        endDate: endDate,
        company_id,
      });
    } catch (error) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao processar datas",
        error: error.message,
      });
    }
  },

  async getExpiringProducts(req, res) {
    try {
      const days = parseInt(req.query.days, 10); // Obtenha 'days' dos parâmetros de consulta
      const { company_id } = req.params;

      // Verifique se o número de dias está presente e é um valor positivo
      if (!days || days <= 0) {
        return res.status(400).send({
          status: 0,
          message: "Número de dias deve ser um valor positivo.",
        });
      }

      // Calcule a data limite para expiração
      const today = new Date();
      const expiryLimit = new Date(today);
      expiryLimit.setDate(today.getDate() + days);

      // Encontre os produtos que vão vencer dentro do intervalo de dias e pertencem ao company_id
      const products = await Product.findAll({
        where: {
          company_id: company_id, // Filtra pelo company_id
          expiry_date: {
            [Sequelize.Op.between]: [today, expiryLimit],
          },
        },
      });

      // Encontre os produtos que já estão vencidos
      const expiredProducts = await Product.findAll({
        where: {
          company_id: company_id, // Filtra pelo company_id
          expiry_date: {
            [Sequelize.Op.lt]: today,
          },
        },
      });

      // Verifique se há produtos prestes a vencer
      if (products.length === 0 && expiredProducts.length === 0) {
        return res.status(200).send({
          status: 1,
          message: "Nenhum produto encontrado para os critérios especificados.",
          days,
        });
      }

      // Retorne os produtos encontrados e a data de expiração
      return res.status(200).send({
        status: 1,
        message: "Produtos encontrados com sucesso!",
        products: products.map((product) => ({
          name: product.name,
          expiry_date: product.expiry_date,
          days_until_expiry: Math.ceil(
            (product.expiry_date - today) / (1000 * 60 * 60 * 24)
          ),
        })),
        expiredProducts: expiredProducts.map((product) => ({
          name: product.name,
          expiry_date: product.expiry_date,
          days_since_expiry: Math.ceil(
            (today - product.expiry_date) / (1000 * 60 * 60 * 24)
          ),
        })),
        days,
        company_id,
      });
    } catch (error) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao buscar produtos",
        error: error.message,
      });
    }
  },
};
