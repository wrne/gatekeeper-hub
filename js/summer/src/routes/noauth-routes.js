import express from "express";
import loginController from "../controllers/auth/login-controllers.js"

const router = express.Router();

router.post('/login', async (req, res) => {

	try {

		res.success(await loginController.authUser(req.body), 'User successful autenticated.')

	} catch (error) {

		res.error(401, error, `User autentication failed`)

	}

});

export default router;