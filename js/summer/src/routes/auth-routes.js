import express from "express";
import authController from "../controllers/auth/login-controllers.js"
import taskController from "../controllers/task/taskControllers.js"
import authMiddleware from "./middleware/auth-middleware.js"
import { logMessage } from "../utils/log-generator.js";

import ordersController from "../controllers/orders/orders-controller.js"

const router = express.Router();
router.use(authMiddleware)

router.post('/newUser', async(req, res) => {
	
	try {
		const usersAdded = authController.newUser(req.body)
		if (usersAdded < 1)
			throw new Error("User include failed ");
		
		logMessage(`User ${req.body.login} added successful`)
		res.success(null,'user added successful.')
		
	} catch (error) {
		
		res.error(500,error,'User adding failed.');
	}
	
});

router.post('/newTaskAgrega', async(req, res) => {
	
	
	try {
		
		if(!taskController.newTask('agrega',req.body))
			throw new Error("task adding failed");
		
		logMessage(`Agrega Task added successful`)
		res.success(null, 'task added successful.')
		
		
	} catch (error) {
		res.error(500, error, 'Failure on add Agregga task')
	}
});

router.post('/newTaskSimulador', async (req, res) => {
	
	try {
		
		await taskController.newTask('simulador',req.body)
		logMessage(`Simulador Task added successful`)

		res.success(null, 'task added successful.')


	} catch (error) {
		res.error(500, error, 'Failure on add Simulador task')
	}
});


router.get('/orders', async (req, res) => {
	
	try {
		logMessage(`Requisition: /orders Params: ${JSON.stringify(req.query)}`)
		const ordersList = await ordersController.getAllOrders(req.query)
		logMessage(`orders List retrieved successful`)

		res.success(ordersList, 'consult proceed successful.')


	} catch (error) {
		res.error(500, error, 'Failure on getting orders')
	}
});



export default router;
