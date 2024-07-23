const jwt = require('jsonwebtoken'); // Importando a dependência jsonwebtoken para lidar com tokens JWT

const authConfig = require('../config/auth.json'); // Importando o arquivo que contém a configuração de autenticação, incluindo a chave secreta

module.exports = (req, res, next) => { // Middleware de autenticação para proteger rotas que exigem autenticação (prossegue com o processo somente quando der um next)

    const authHeader = req.headers.authorization; // Obtendo o cabeçalho de autorização da requisição, onde o token JWT é enviado

    if (!authHeader) {  // Verificando se o cabeçalho de autorização está presente na requisição
        return res.status(401).send({ error: 'Token não fornecido' }); // Se não estiver presente, retornando um erro de não autorizado (status 401)
    }

    const parts = authHeader.split(' '); // Dividindo o token em duas partes: o esquema (scheme) e o token em si

    if (!parts.length == 2) { // Verificando se o token foi dividido corretamente em duas partes (esquema e token)
        return res.status(401).send({ error: 'Erro no token!' }); // Se não foi, retornando um erro de não autorizado (status 401)
    }

    const [scheme, token] = parts; // Desestruturando o array 'parts' em 'scheme' (esquema) e 'token'

    if (!/^Bearer$/i.test(scheme)) { // Utilizando uma expressão regular (regex) para verificar se o esquema é 'Bearer', ignorando maiúsculas e minúsculas
        return res.status(401).send({ error: 'Token mal formatado' }); // Se não for, retornando um erro de não autorizado (status 401)
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => { // Verificando se o token é válido usando a chave secreta

        if (err) return res.status(401).send({ error: 'Token inválido' }); // Se houver erro na verificação do token, retornando um erro de não autorizado (status 401)

        req.userId = decoded.id; // Se o token for válido, armazenando o ID do usuário autenticado no objeto 'req' para uso posterior
        console.log(decoded.id) // Imprimindo o ID do usuário autenticado no console (apenas para fins de depuração)

        return next(); // Chamando a próxima função middleware para permitir que a requisição prossiga
    });

};
