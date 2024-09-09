const User = require("../models/User");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const authConfig = require("../config/auth");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 78300,
  });
}

module.exports = {

  // Realizar login no sistema
  async login(req, res) {

    const { password, email } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(404).send({
          status: 0,
          message: "Usuário não encontrado nesta empresa.",
        });
      }

      // Verifica se o e-mail foi fornecido
      if (!email) {
        return res.status(400).send({
          status: 0,
          message: "E-mail é obrigatório!",
          user: {},
        });
      }

      // Verifica a senha
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send({
          status: 0,
          message: "E-mail ou senha incorreto!",
          user: {},
        });
      }

      // Verifica se o usuário já está logado
      if (user.is_logged) {
        return res.status(403).send({
          status: 0,
          message: "Usuário já está logado!",
          user: {},
        });
      }

      // Atualiza o status de login do usuário
      await User.update({ is_logged: true }, { where: { id: user.id } });

      // Remove a senha do objeto do usuário antes de retornar a resposta
      user.password = undefined;

      // Gera o token de autenticação
      const token = generateToken({ id: user.id });

      // Retorna a resposta de sucesso
      return res.status(200).send({
        status: 1,
        message: "Usuário logado com sucesso!",
        user,
        token,
      });

    } catch (err) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao processar o login do usuário.",
        error: err.message,
      });
    }
  },

  // Lista 1 usuário específico de uma empresa específica
  async index(req, res) {

    try {
      const { user_id } = req.params;
      const { company_id } = req.params;

      // Busca os usuários associados à empresa
      const users = await User.findOne({
        where: {
          id: user_id,
          company_id: company_id,
        },
        attributes: { exclude: ["password"] }, // Exclui a senha da resposta
      });

      if (!users) {
        return res.status(404).send({ message: "Usuário não encontrado." });
      }

      if (users.length === 0) {
        return res
          .status(200)
          .send({ message: "Nenhum usuário cadastrado para esta empresa." });
      }

      return res.status(200).send({ users });
    } catch (err) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao buscar usuário.",
        error: err.message,
      });
    }
  },

  // Listas todos usuários do sistema
  async indexAll(req, res) {

    try {
      const { user_id } = req.params;

      const users = await User.findAll({
        attributes: { exclude: ["password"] }, // Exclui a senha da resposta
      });

      if (!users) {
        return res.status(404).send({ message: "Usuário não encontrado." });
      }

      if (users.length === 0) {
        return res
          .status(200)
          .send({ message: "Nenhum usuário cadastrado para esta empresa." });
      }

      return res.status(200).send({ users });
    } catch (err) {

      return res.status(500).send({
        status: 0,
        message: "Erro ao buscar usuários.",
        error: err.message,
      });
    }
  },

  // Lista todos usuários de uma empresa específica
  async indexAllCompany(req, res) {

    try {
      const { company_id } = req.params;

      // Busca os usuários associados à empresa
      const users = await User.findAll({
        where: {
          company_id: company_id,
        },
        attributes: { exclude: ["password"] }, // Exclui a senha da resposta
      });

      if (!users) {
        return res.status(404).send({ message: "Usuário não encontrado." });
      }

      if (users.length === 0) {
        return res
          .status(200)
          .send({ message: "Nenhum usuário cadastrado para esta empresa." });
      }

      return res.status(200).send({ users });

    } catch (err) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao buscar usuários.",
        error: err.message,
      });
    }
  },

  // Realizar logout
  async logout(req, res) {

    try {
      const { user_id } = req.params;
      const { company_id } = req.params;

      // Encontre o usuário pelo ID
      const user = await User.findOne({
        where: {
          id: user_id,
        },
      });

      // Verifique se o usuário foi encontrado
      if (!user) {
        return res.status(404).send({ message: "Usuário não cadastrado." });
      }

      // Verifique se o usuário já está deslogado
      if (!user.is_logged) {
        return res.status(400).send({
          status: 0,
          message: "Usuário não está logado!",
        });
      }

      // Atualize o campo is_logged para false
      await User.update({ is_logged: false }, { where: { id: user_id } });

      return res.status(200).send({
        status: 1,
        message: "Usuário deslogado com sucesso!",
      });

    } catch (error) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao tentar deslogar",
        error: error.message,
      });
    }
  },

  // Cadastrar usuário
  async store(req, res) {

    try {
      const {name, password, email, code, birthday_date, cpf, phone, education, company_id} = req.body;

      // Verifica se o CPF já existe
      const existingCpf = await User.findOne({ where: { cpf } });

      if (existingCpf) {
        return res.status(400).send({
          status: 0,
          message: "CPF já cadastrado.",
        });
      }

      // Verifica se o e-mail já existe
      const existingEmail = await User.findOne({ where: { email } });

      if (existingEmail) {
        return res.status(409).send({
          status: 0,
          message: "Endereço de e-mail já cadastrado.",
        });
      }

      // Crie o novo usuário
      const user = await User.create({name, password, email, code, birthday_date, cpf, phone, education, company_id});

      user.password = undefined; // Remove a senha da resposta

      return res.status(201).send({
        status: 1,
        message: "Usuário cadastrado com sucesso!",
        user,
      });

    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return res.status(500).send({
        status: 0,
        message: "Erro ao cadastrar usuário.",
        error: error.message, 
      });
    }
  },

  // Atualizar usuário
  async update(req, res) {

    const {name, email, code, birthday_date, cpf, phone, education, password,} = req.body;
    const { user_id } = req.params;
    const { company_id } = req.params; 

    try {
      // Encontra o usuário a ser atualizado
      const user = await User.findOne({
        where: {
          id: user_id,
          company_id: company_id, 
        },
      });

      if (!user) {
        return res.status(404).send({
          status: 0,
          message: "Usuário não encontrado nesta empresa.",
        });
      }

      // Prepara os dados para atualização
      let updateData = {name, email, code, birthday_date, cpf, phone, education};

      // Verifica se a senha foi fornecida e criptografa ela
      if (password) {
        const salt = bcrypt.genSaltSync();
        updateData.password = bcrypt.hashSync(password, salt);
      }

      // Atualiza o usuário no banco de dados
      await User.update(updateData, {
        where: {
          id: user_id,
        },
      });

      // Retorna sucesso
      return res.status(200).send({
        status: 1,
        message: "Usuário atualizado com sucesso!",
      });

    } catch (err) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao processar a atualização do usuário.",
        error: err.message,
      });
    }
  },

  // Deletar usuário
  async delete(req, res) {
    try {
      const { user_id } = req.params;
      const { company_id } = req.params;

      // Verifica se o usuário existe
      const user = await User.findOne({
        where: {
          id: user_id,
          company_id: company_id,
        },
      });

      if (!user) {
        return res.status(404).send({
          status: 0,
          message: "Usuário não encontrado nesta empresa.",
        });
      }

      // Deleta o usuário
      await User.destroy({
        where: { id: user_id },
      });

      return res.status(200).send({
        status: 1,
        message: "Usuário deletado com sucesso!",
      });

    } catch (err) {
      return res.status(500).send({
        status: 0,
        message: "Erro interno do servidor.",
        error: err.message,
      });
    }
  },

  // Esquecer senha
  async forgotPassword(req, res) {

    const { cpf, birthday_date, newPassword } = req.body;

    // Validação dos dados de entrada
    if (!cpf || !birthday_date || !newPassword) {
      return res.status(400).send({
        status: 0,
        message: "Dados de entrada incompletos!",
      });
    }

    const user = await User.findOne({
      where: {
        cpf: cpf,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 0,
        message: "Usuário não encontrado nesta empresa.",
      });
    }

    try {
      // Converte a data fornecida para o formato YYYY-MM-DD
      const formattedBirthdayDate = new Date(birthday_date)
        .toISOString()
        .split("T")[0];

      // Verifica se o usuário existe com o CPF
      const user = await User.findOne({
        where: { cpf },
      });

      // Se o usuário não for encontrado
      if (!user) {
        return res.status(404).send({
          status: 0,
          message: "Usuário não encontrado!",
        });
      }

      // Converte a data de nascimento do usuário para o formato YYYY-MM-DD
      const userBirthdayDate = new Date(user.birthday_date)
        .toISOString()
        .split("T")[0];

      // Verifica se a data de nascimento está correta
      if (formattedBirthdayDate !== userBirthdayDate) {
        return res.status(400).send({
          status: 0,
          message: "CPF ou data de nascimento incorretos!",
        });
      }
      8081;

      // Atualiza a senha com criptografia
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(newPassword, salt);

      await User.update(
        { password: hashedPassword },
        { where: { id: user.id } }
      );

      return res.status(200).send({
        status: 1,
        message: "Senha redefinida com sucesso!",
      });
    } catch (err) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao redefinir a senha.",
        error: err.message,
      });
    }
  },

  // Editar senha
  async changePassword(req, res) {

    const { email, oldPassword, newPassword } = req.body;
    const { user_id } = req.params;
    const { company_id } = req.params;

    const user = await User.findOne({
      where: {
        id: user_id,
        company_id: company_id, 
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 0,
        message: "Usuário não encontrado nesta empresa.",
      });
    }

    try {

      if (!user || user.email != email) {
        return res.status(404).send({
          status: 0,
          message: "Usuário não encontrado!",
        });
      }

      // Verifica se a senha antiga está correta
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(400).send({
          status: 0,
          message: "Senha antiga incorreta!",
        });
      }

      // Atualiza a senha com criptografia
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(newPassword, salt);

      await User.update(
        { password: hashedPassword },
        { where: { id: user.id, company_id } }
      );

      return res.status(200).send({
        status: 1,
        message: "Senha alterada com sucesso!",
      });
    } catch (err) {
      return res.status(500).send({
        status: 0,
        message: "Erro ao alterar a senha.",
        error: err.message,
      });
    }
  },
};
