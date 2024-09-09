const express = require("express"); // Importando o módulo 'express', um framework web para Node.js.

const router = express.Router(); // Criando uma instância do roteador do Express.

const UserController = require("./controllers/UserController");
const ProductController = require("./controllers/ProductController");
const Analytics = require('./controllers/AnalyticsController');
const CompanyController = require("./controllers/CompanyController");
const FinanceController = require("./controllers/FinanceController");
const authMiddleware = require("./middlewares/auth");

module.exports = router; // Exportando o roteador para que possa ser utilizado em outros arquivos do projeto.

//   ==  User   ==   //
router.post("/users", UserController.store);
router.post("/users/login", UserController.login);

//   ==  Company   ==   //
router.get("/companys", CompanyController.index);
router.get("/companys/:company_id", CompanyController.show);
router.post("/companys", CompanyController.store);
router.put("/companys/:company_id", CompanyController.update);
router.get(
  "/companys/:company_id/employees",
  CompanyController.listEmployeesByCompany
);

router.get('/analysis/:company_id', Analytics.executeAnalisys);

// ==============================================================================
// A partir daqui as funções precisarão do token:
// router.use(authMiddleware);
// ==============================================================================

//   ==  User   ==   //

router.get("/users", UserController.indexAll);
router.get("/users/:company_id", UserController.indexAllCompany);
router.get("/users/:user_id/:company_id", UserController.index);
router.put("/users/:user_id/:company_id", UserController.update);
router.post("/users/logout/:user_id/:company_id", UserController.logout);
router.delete("/users/:user_id/:company_id", UserController.delete);
router.post("/users/forgot/:company_id", UserController.forgotPassword);
router.put("/users/change/:user_id/:company_id", UserController.changePassword);

//   ==  Product   ==   //
// Funções externas:
router.delete("/products/:code/:company_id", ProductController.delete);
router.put("/products/:code/:company_id", ProductController.update);
router.get("/products/:company_id", ProductController.index);
router.get(
  "/products/get-expiring-products/:company_id",
  ProductController.getExpiringProducts
);
router.delete(
  "/products/decrease-quantity/:code/:company_id",
  ProductController.deleteQuantity
);
router.get("/products/search/:company_id", ProductController.searchByName);
router.post(
  "/products/check-date-range/:company_id",
  ProductController.checkDateRange
); // se necessário (análise dados)

// Funções internas:
// router.put('/products/decrease/:code', ProductController.decreaseQuantity);
// router.put('/products/increase/:code', ProductController.increaseQuantity);
// router.post('/products', ProductController.store);

//   ==  Finance   ==   //
router.post("/finances/:company_id", FinanceController.store);
router.delete(
  "/finances/cancel-sale/:company_id",
  FinanceController.cancelSale
);
router.post("/finances/sales/:company_id", FinanceController.recordSale);

router.get("/finances/:company_id", FinanceController.index);
router.post(
  "/finances/close_cash/:company_id",
  FinanceController.closeCashRegister
);
router.post(
  "/finances/filter_by_date_range/:company_id",
  FinanceController.filterByDateRange
);
// router.post(
//   "/finances/:cash_register/:company_id",
//   FinanceController.show_sales
// );

router.get("/", (request, response) => {
  return response.send("Servidor rodando :)"); // Respondendo à requisição GET na rota raiz com uma mensagem "Servidor rodando :)".
});
