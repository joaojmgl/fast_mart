const Company = require("../models/Company");
const Address = require("../models/Address");
const Users = require("../models/User");

const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const { where } = require("sequelize");

const sequelize = new Sequelize(dbConfig);

module.exports = {

  // listar todas as empresas
  async index(req, res) {
    try {
      const company = await Company.findAll();
      return res.json(company);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server Error." });
    }
  },

  // mostra uma empresa específica
  async show(req, res) {
    try {
      const { company_id } = req.params;

      const address = await Address.findOne({
        where: { id: company_id },
      });
      const company = await Company.findOne({ where: { id: company_id } });

      if (!company) {
        return res.status(404).send({
          status: 0,
          message: "Empresa não existe",
        });
      }

      return res.status(200).send({
        status: 1,
        company,
        address,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        status: 0,
        message: "Internal server erro.",
      });
    }
  },

  //cadastra empresa
  async store(req, res) {
    try {
      const { comp_name, comp_cnpj, comp_employees, address } = req.body;

      // Verificar se o CNPJ já existe
      const company = await Company.findOne({ where: { comp_cnpj } });

      if (company) {
        return res.status(422).json({ message: `Credenciais já cadastradas.` });
      }

      // Criar nova empresa
      const new_company = await Company.create({
        comp_name,
        comp_cnpj,
        comp_employees,
      });

      // Criar endereço associado à empresa
      const comp_address = await Address.create({
        street: address.street,
        number: address.number,
        district: address.district,
        city: address.city,
        state: address.state,
        company_id: new_company.id,
      });
      return res.status(201).json(comp_address);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal serve error." });
    }
  },

  // atualiza empresa
  async update(req, res) {
    try {
      const { comp_name, comp_cnpj, comp_employees, address } = req.body;
      const { company_id } = req.params;

      // Verifica se a empresa existe
      const company = await Company.findOne({ where: { id: company_id } });

      if (!company) {
        return res.status(404).send({
          status: 0,
          message: "Empresa não encontrada.",
        });
      }

      // Atualiza o nome, CNPJ e número de funcionários da empresa
      let updateData = {
        comp_name,
        comp_cnpj,
        comp_employees,
      };

      try {
        await Company.update(updateData, {
          where: { id: company_id },
        });
      } catch (err) {
        return res.status(502).send({
          status: 0,
          message: "Erro ao atualizar empresa.",
          error: err.message,
        });
      }

      // Atualiza o endereço se os dados estiverem presentes
      if (address && typeof address === "object") {
        let updateData_address = {
          street: address.street,
          number: address.number,
          district: address.district,
          city: address.city,
          state: address.state,
        };
        try {
          await Address.update(updateData_address, {
            where: { company_id: company_id },
          });
        } catch (err) {
          return res.status(502).send({
            status: 0,
            message: "Erro ao atualizar endereço da empresa.",
            error: err.message,
          });
        }
      }

      return res.status(200).send({
        status: 1,
        message: "Empresa atualizada com sucesso!",
      });
    } catch (err) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao processar a atualização da empresa.",
        error: err.message,
      });
    }
  },

  // exibe todos os funcionáriso de uma empresa
  async listEmployeesByCompany(req, res) {
    try {
      const { company_id } = req.params;

      // Verifica se a empresa existe
      const company = await Company.findOne({ where: { id: company_id } });
      if (!company) {
        return res.status(404).send({
          status: 0,
          message: "Empresa não encontrada.",
        });
      }

      // Busca todos os funcionários associados à empresa
      const employees = await Users.findAll({
        where: { company_id },
      });

      return res.status(200).send({
        status: 1,
        employees,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        status: 0,
        message: "Erro interno do servidor.",
      });
    }
  },
};
