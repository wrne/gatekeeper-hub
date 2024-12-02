import express from "express";
import authController from "../controllers/auth/authControllers.js"
import taskController from "../controllers/task/taskControllers.js"
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

router.post('/newTaskAgrega', async(req, res) => {
	
	if(taskController.newTask('agrega',req.body)){
		res.send('task added successful.');
	} else {
		res.send('task adding failed.');
	}
});

router.post('/newTaskSimulador', async(req, res) => {
	
	if(taskController.newTask('simulador',req.body)){
		res.send('task added successful.');
	} else {
		res.send('task adding failed.');
	}
});


export default router;
