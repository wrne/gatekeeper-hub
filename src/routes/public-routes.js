import express from "express";
import loginController from "../controllers/auth/login-controllers.js"

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json"  with { type: 'json' };

const router = express.Router();

// Rota para a documentação da API
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota para autenticação do usuário
router.post('/login', async (req, res) => {

	try {

		res.success(await loginController.authUser(req.body), 'User successful autenticated.')

	} catch (error) {

		res.error(401, error, `User autentication failed`)

	}

});

export default router;