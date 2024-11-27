import express from "express";
import authController from "../controllers/auth/authControllers.js"
import authMiddleware from "../middleware/auth-middleware.js"

const router = express.Router();
router.use(authMiddleware)

router.post('/newUser', async(req, res) => {
	
	if(authController.newUser(req.body)){
		res.send('user added successful.');
	} else {
		res.send('user adding failed.');
	}
});


export default router;
