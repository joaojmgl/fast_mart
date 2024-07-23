const User = require('../models/User');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth')


function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 78300,
    });
}

module.exports = {

    async login(req, res) {
        const { password, email } = req.body;
    
        try {
            const user = await User.findOne({ where: { email } });
    
            if (!user) {
                return res.status(400).send({
                    status: 0,
                    message: 'E-mail ou senha incorreto!',
                    user: {}
                });
            }
            
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(400).send({
                    status: 0,
                    message: 'E-mail ou senha incorreto!',
                    user: {}
                });
            }
            
            if (user.is_logged == 1) {
                return res.status(403).send({
                    status: 0,
                    message: 'Usuário já está logado!',
                    user: {}
                });
            }
            const user_id = user.id;
    
            await User.update({ is_logged: 1 }, { where: { id: user_id } });
    
            user.password = undefined;
    
            const token = generateToken({ id: user.id });
    
            return res.status(200).send({
                status: 1,
                message: "Usuário logado com sucesso!",
                user,
                token
            });
        } catch (err) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao processar o login do usuário.',
                error: err.message
            });
        }
    },

    async index(req, res) {
        try {
            
            const users = await User.findAll({
                attributes: { exclude: ['password'] } // Exclui a senha da resposta
            });
    
            if (!users || users.length === 0) {
                return res.status(200).send({ message: "Nenhum usuário cadastrado" });
            }
            
            return res.status(200).send({ users });

        } catch (err) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao buscar usuários.',
                error: err.message
            });
        }
    },

    async logout(req, res) {
        try {
            const { user_id } = req.params;
            
            const user = await User.findOne({ where: { id: user_id } });

            if (!user || user.length === 0) {
                return res.status(200).send({ message: "Usuário não cadastrado." });
            }

            if (user.is_logged == 0) {
                return res.status(400).send({
                    status: 0,
                    message: 'Usuário não está logado!'
                });
            }

            // Atualiza o campo isLogged para false ou limpa informações de sessão
            await User.update({ is_logged: false }, { where: { id: user_id } });

            return res.status(200).send({
                status: 1,
                message: 'Usuário deslogado com sucesso!'
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao tentar deslogar',
                error: error.message
            });
        }
    },

    async store(req, res) {
        try {
            const { name, password, email, code, birthday_date, cpf, phone, education } = req.body;

            // Verifique se o CPF já existe
            const existingCpf = await User.findOne({ where: { cpf } });

            const existingEmail = await User.findOne({ where: { email } });

            if (existingCpf) {
                return res.status(400).send({
                    status: 0,
                    message: 'CPF já cadastrado.',
                });
            }

            if (existingEmail) {
                return res.status(406).send({
                    status: 0,
                    message: 'Endereço de e-mail já cadastrado.',
                });
            }

            // Crie o novo usuário
            const user = await User.create({ name, password, email, code, birthday_date, cpf, phone, education });

            user.password = undefined; // Remova a senha da resposta

            return res.status(200).send({
                status: 1,
                message: 'Usuário cadastrado com sucesso!',
                user,
            });

        } catch (error) {
            return res.status(500).send({
                status: 0,
                message: 'Erro ao cadastrar usuário',
                error: error.message, // Retorna a mensagem de erro para diagnóstico
            });
        }
    },

    async update(req, res) {
        
        const { name, password, email, code, phone, education } = req.body;
        const { user_id } = req.params;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).send({
                status: 0,
                message: 'Usuário não encontrado.',
            });
        }
    
        try {
            // Verificar se a senha foi fornecida e criptografá-la
            let updateData = { name, email, code, phone, education };
            if (password) {
                try {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    updateData.password = hashedPassword;
                } catch (err) {
                    return res.status(503).send({
                        status: 0,
                        message: "Erro ao criptografar a senha.",
                        error: err.message
                    });
                }
            }
    
            // Atualizar o usuário no banco de dados
            try {
                await User.update(updateData, {
                    where: {
                        id: user_id
                    }
                });
            } catch (err) {
                return res.status(502).send({
                    status: 0,
                    message: "Erro ao atualizar o usuário no banco de dados.",
                    error: err.message
                });
            }
    
            return res.status(200).send({
                status: 1,
                message: "Usuário atualizado com sucesso!",
            });

        } catch (err) {
            return res.status(500).send({
                status: 0,
                message: "Erro ao processar a atualização do usuário.",
                error: err.message
            });
        }
    }
    
};