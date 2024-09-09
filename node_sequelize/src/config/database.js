module.exports = {
  host: "localhost", // Endereço do banco de dados MySQL. Neste caso, está sendo utilizado o banco de dados local.
  dialect: "mysql", // Dialeto do banco de dados que está sendo utilizado. Neste caso, é MySQL.
  username: "root", // Nome de usuário para acessar o banco de dados.
  password: "senha", // Senha para acessar o banco de dados.
  database: "fastmart", // Nome do banco de dados que está sendo utilizado ou será criado.
  define: {
    timestamps: true, // Define se as colunas createdAt e updatedAt serão automaticamente adicionadas a todas as tabelas. Quando true, essas colunas são adicionadas por padrão.
    underscored: true, // Define se o padrão de nomenclatura para tabelas e colunas seguirá o estilo snake_case em vez de camelCase. Quando true, o Sequelize usará o estilo snake_case.
  },
};
