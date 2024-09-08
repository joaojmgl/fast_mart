const { execSync } = require('child_process');

module.exports = {
    async executeAnalisys(req, res) {
        try {
            // Mudança de diretório e execução do script Python -- COLOCAR CAMINHO CORRETO PARA A PASTA DATA-ANALISYS AQUI (TEM QUE ESTAR ENTRE "")
            execSync(`cd "C:/Users/Gustavo Henrique/Desktop/fast_mart/node_sequelize/src/data-analisys" && python start_server.py`, { stdio: 'inherit' });

            return res.status(200).send({
                status: 1,
                message: 'Comando executado com sucesso!',
            });
        } catch (error) {
            console.error(`Erro ao executar o comando: ${error.message}`);
            return res.status(500).send({
                status: 0,
                message: `Erro ao executar o comando: ${error.message}`,
            });
        }
    },
};
