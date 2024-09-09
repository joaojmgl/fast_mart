
# Node.js + Express + Sequelize + MariaDB

Este template fornece uma configuração mínima para rodar um back-end com **Node.js**, **Express**, **Sequelize** e **MariaDB**, com suporte para **Autenticação JWT** e segurança aprimorada com **bcrypt**. 

## Configuração do Banco de Dados

No arquivo `node_sequelize/src/config/database.js`, configure os seguintes parâmetros:

- Nome do Banco de Dados
- Senha
- Nome de Usuário

# Compilação e Execução

| **Etapa**             | **Comando**               | **Descrição**                                                                                           |
|-----------------------|---------------------------|-------------------------------------------------------------------------------------------------------|
| **Aplicar Migrações** | `npx sequelize db:migrate` | Aplica todas as migrações pendentes ao banco de dados.                                               |
| **Rodar o Servidor**  | `npm run dev`             | Executa o servidor em modo de desenvolvimento.                                                        |

### Observação

Certifique-se de executar esses comandos dentro da pasta `node_sequelize`.


