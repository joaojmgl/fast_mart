const Company = require( "../models/Company")
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');


const sequelize = new Sequelize(dbConfig);


module.exports = {
    index: async function (req, res) {
        try {
            const company = await Company.findAll();
            return res.json(company);
        } catch (err) {
            console.log(err);
            return res.status(500).json({error: "Internal server Error."});
        }
    },

    async show(req, res) {
        try {
            const {company_id} = req.params;
            const company = await Company.findOne({where:{id:company_id}})

            if (!company) {
                return res.status(404).send({
                    status: 0,
                    message: "Empresa não existe",
                })
            }
            return res.status(200).send({
                status: 1,
                company,
            })

        } catch (err) {
            console.log(err);
            return res.status(500).send({
                status: 0,
                message:"Internal server erro."
            })
        }
    },

    async store(req, res) {
        try {
            const {company_name, comp_cnpj, comp_employees,comp_address} = req.body;
            const company = await Company.findOne({where:{comp_cnpj}})

            if (company) {
                return res.status(422).json({message: `Company ${company_name} already exists.`})
            }
            console.log("passei")
            const new_company = await Company.create({
                comp_name: company_name,
                comp_cnpj: comp_cnpj,
                comp_employees: comp_employees,
                comp_address: comp_address,
            });
            return res.status(201).json(new_company);
        } catch (err) {
            console.log(err);
            return res.status(500).json({error: "Internal serve error."});
        }
    }
}
