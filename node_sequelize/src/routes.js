
const express = require('express'); // Importando o módulo 'express', um framework web para Node.js.

const router = express.Router(); // Criando uma instância do roteador do Express.

const UserController = require('./controllers/UserController'); // Importando o UserController

module.exports = router; // Exportando o roteador para que possa ser utilizado em outros arquivos do projeto.

router.get('/users', UserController.index); // Definindo as rotas que irão chamar o método index do UserController
router.post('/users', UserController.store);
router.put('/users/:user_id', UserController.update);
router.post('/users/login', UserController.login);
router.post('/users/logout/:user_id', UserController.logout);

router.get('/', (request, response) => {
    return response.send("Servidor rodando :)"); // Respondendo à requisição GET na rota raiz com uma mensagem "Servidor rodando :)".
});
