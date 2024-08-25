const Company = require( "../models/Company")
const Address = require( "../models/Address")
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const {where} = require("sequelize");


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
            const {comp_name,comp_cnpj,comp_employees,address} = req.body;

            const company = await Company.findOne({where:{comp_cnpj}})
            console.log("erro")
            // if (company) {
            //     return res.status(422).json({message: `Company ${company_name} already exists.`})
            // }
            const new_company = await Company.create({
                comp_name,
                comp_cnpj,
                comp_employees,
            });
            console.log(new_company.id)
            const comp_address = await Address.create({
                address,
                company_id : new_company.id,
            })
            return res.status(201).json(new_company);
        } catch (err) {
            console.log(err);
            return res.status(500).json({error: "Internal serve error."});
        }
    },
    async update(req, res) {

        const {company_name, comp_cnpj, comp_employees,comp_address} = req.body;
        const {comp_id} = req.params;
        const comp = await Company.findByPk(comp_id);
        const {address_id} = comp_address.id
        const address = await Address.update(comp_address,{
            where:{id:address_id}
            }
        )
        if (!comp) {
            return res.status(404).send({
                status: 0,
                message: 'Empresa não encontrada.',
            });
        }

        try {

            let updateData = {company_name, comp_cnpj, comp_employees,addresses_id:address_id};

            try {
                await Company.update(updateData, {
                    where: {
                        id: comp_id
                    }
                });
            } catch (err) {
                return res.status(502).send({
                    status: 0,
                    message: "Erro ao atualizar empresa.",
                    error: err.message
                });
            }

            return res.status(200).send({
                status: 1,
                message: "Empresa atualizado com sucesso!",
            });

        } catch (err) {
            return res.status(500).send({
                status: 0,
                message: "Erro ao processar a atualização da empresa.",
                error: err.message
            });
        }
    },


}
