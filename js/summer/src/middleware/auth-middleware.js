import AuthUtils from "../auth/auth-utils.js"

// Middleware que será aplicado somente ao grupo de rotas
export default async function authMiddleware(req, res, next) {
	console.log(`Request URL: ${req.originalUrl}`)
	console.log(`Request Method: ${req.method}`)
	console.log(`Request Header: ${req.headers.authorization}`)
	
	// Verifica se o cabeçalho Authorization existe
	const authHeader = req.headers.authorization
	
	if (!authHeader) {
		return res.status(401).json({ error: 'Token de autenticação não fornecido.' })
	}
	
	// Extraindo o token (formato esperado: "Bearer <token>")
	const token = authHeader.split(' ')[1]
	const {login} = await AuthUtils.verifyTokenJWT(token)
	// const dataToken = AuthUtils.verifyTokenJWT(token)


	// Verificando a validade do token
	if (!!login){
		// Adiciona os dados do usuário ao objeto `req` para uso em rotas protegidas
		req.user = login;
		next(); // Passa o controle para a próxima função ou rota

	} else {

		return res.status(403).json({ error: 'Token inválido ou expirado.' });
	}

};