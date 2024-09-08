const { exec } = require('child_process');



module.exports = {
    async executeAnalisys(res,req) {
        comando_1 = "cd /home/jmgl/Documentos/fast_mart/node_sequelize/src/data-analisys && ls"
        // args_1 = ["/home/jmgl/Documentos/fast_mart/node_sequelize/src/data-analisys"]
        comando_2 = "streamlit run analise.py"
        // args_2 = "analise.py"
        try{
            exec(comando_1, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro ao executar o comando: ${error.message}`);
                    return;
                }

                if (stderr) {
                    console.error(`Erro no terminal: ${stderr}`);
                    return;
                }

                console.log(`Resultado: ${stdout}`);
            });
            return res.status(200).send({
                status: 0,
            })
    }catch(err) {
            console.log(err);
                // return res.status(500).send({
                //     status: 0,
                //     message:"Internal server erro."
                // })

        }try{
            exec(comando_2, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro ao executar o comando: ${error.message}`);
                    return;
                }

                if (stderr) {
                    console.error(`Erro no terminal: ${stderr}`);
                    return;
                }

                console.log(`Resultado: ${stdout}`);
            });
            return res.status(200).send({
                status: 0,
            })
        }catch(err) {
            console.log(err);
            // return res.status(500).send({
            //     status: 0,
            //     message:"Internal server erro."
            // })

        }
    }
}
