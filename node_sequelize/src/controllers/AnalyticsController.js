const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

module.exports = {
    async executeAnalisys(req, res) {
        try {
            const id = req.params.company_id;
            const tempFilePath = path.join(__dirname, 'company_id.txt'); // Define o caminho do arquivo temporário

            // Salva o company_id no arquivo temporário
            fs.writeFileSync(tempFilePath, id);

            // Mudança de diretório e execução do script Python
            // MUDAR O CAMINHO AQUI
            execSync(`cd "C:/Users/julia/Documents/GitHub/fast_mart/node_sequelize/src/data-analisys" && python start_server.py`, { stdio: 'inherit' });

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