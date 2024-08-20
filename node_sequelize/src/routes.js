
const express = require('express'); // Importando o módulo 'express', um framework web para Node.js.

const router = express.Router(); // Criando uma instância do roteador do Express.

const UserController = require('./controllers/UserController'); // Importando o UserController
const ProductController = require('./controllers/ProductController'); // Importando o ProductController
const CompanyController =  require('./controllers/CompanyController');
const FinanceController = require('./controllers/FinanceController');
const authMiddleware = require('./middlewares/auth');

module.exports = router; // Exportando o roteador para que possa ser utilizado em outros arquivos do projeto.

// Usuários
router.post('/users', UserController.store);
router.post('/users/login', UserController.login);

//Company
router.get('/companys', CompanyController.index);
router.get('/companys/:company_id', CompanyController.show);
router.post('/companys', CompanyController.store);
router.put('/companys/:company_id', CompanyController.update);

// ==============================================================================
// A partir daqui as funções precisarão do token:
router.use(authMiddleware);
// ==============================================================================


// Usuários
router.get('/users', UserController.index); // Definindo as rotas que irão chamar o método index do UserController
router.put('/users/:user_id', UserController.update);
router.post('/users/logout/:user_id', UserController.logout);
router.delete('/users/:user_id', UserController.delete);
router.post('/users/forgot', UserController.forgotPassword);
router.put('/users/change/:user_id', UserController.changePassword);


// Produtos
router.delete('/products/:code', ProductController.delete);
router.put('/products/:code', ProductController.update);
router.get('/products', ProductController.index);
router.put('/products/decrease/:code', ProductController.decreaseQuantity);
router.put('/products/increase/:code', ProductController.increaseQuantity);
router.post('/products', ProductController.store);
router.post('/check-date-range', ProductController.checkDateRange);
router.post('/get-expiring-products', ProductController.getExpiringProducts);
// router.put('/products/decrease', ProductController.decreaseQuantity);
// router.get('/products/search', ProductController.searchByName);


// Financias
router.post('/finances', FinanceController.store);
router.get('/finances', FinanceController.index);
router.post('/finances/close_cash', FinanceController.closeCashRegister);
router.post('/finances/filter_by_date_range', FinanceController.filterByDateRange);
router.post('/finances/:cash_register', FinanceController.show_sales);  
router.post('/sales', FinanceController.recordSale );


router.get('/', (request, response) => {
    return response.send("Servidor rodando :)"); // Respondendo à requisição GET na rota raiz com uma mensagem "Servidor rodando :)".
});
