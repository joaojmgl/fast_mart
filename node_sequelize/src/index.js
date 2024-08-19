// Importando o módulo 'express', um framework web para Node.js.
const express = require("express");

const cors = require("cors");

// Importando o arquivo de rotas do projeto.
const routes = require("./routes.js");

// Importando o database.
require("./database");

// Criando uma instância do Express.
const app = express();

// Habilitando o middleware do Express para análise de JSON.
app.use(express.json());

// Configuração do CORS para permitir acesso do frontend
app.use(cors());

// Usando as rotas definidas no arquivo 'routes.js'.
app.use(routes);

// Iniciando o servidor Express na porta 3333 para ouvir as solicitações.
app.listen(3333, () => {
  console.log("Servidor backend rodando na porta 3333");
});
