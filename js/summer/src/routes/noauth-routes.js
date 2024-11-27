import express from "express";
import authController from "../controllers/auth/authControllers.js"

const router = express.Router();

router.post('/login', async(req, res) => {

	res.send(await authController.authUser(req.body));

	// if( await authController.authUser(req.body)){
	// 	res.send('user autenticated successful. ');
	// } else {
	// 	res.send('user autentication failed.');
	// }
});

export default router;