import express from "express";
import ordersController from "../../controllers/orders/orders-controller.js"

import { logMessage } from "../../utils/log-generator.js";

const router = express.Router();

router.post('/', async (req, res) => {

	try {

		await ordersController.putNewOrder(req.userRole, req.body) // Por ora, usamos o role do usuário para definir a origem de pedido, futuramente podemos criar um mecanismo para mapear isso.
		logMessage(`Order created successful`)
		
		res.success(null, 'Order receipt successful.')

	} catch (error) {
		res.error(500, error, 'Failure on creating order')
		
	}
});

/**
 * Rota de Consulta de pedidos - Listagem de acordo com os filtros
 */
router.get('/',async (req, res) => {
	
	try {
		
		const ordersList = await ordersController.getAllOrders(req.query)
		logMessage(`orders List retrieved successful`)

		res.success(ordersList, 'consult proceed successful.')


	} catch (error) {
		res.error(500, error, 'Failure on getting orders')
	}

});

/**
 * Rota de Consulta de pedidos - Listagem de acordo com os filtros
 */
router.get('/items', async (req, res) => {
	
	try {
		
		const ordersList = await ordersController.getAllOrders(req.query, {withItems: true})
		logMessage(`orders List retrieved successful`)

		res.success(ordersList, 'consult proceed successful.')


	} catch (error) {
		res.error(500, error, 'Failure on getting orders')
	}

});

/**
 * Rota de Consulta de pedido por ID
 */
router.get('/:id', async (req, res) => {
	
	try {
		
		
		const [order] = await ordersController.getAllOrders({id: req.params.id})
		logMessage(`order retrieved successful`)

		res.success(order, 'consult proceed successful.')

	} catch (error) {
		res.error(500, error, 'Failure on getting order')
	}
});

/**
 * Rota de Consulta de pedido por ID com Itens
 */
router.get('/:id/items', async (req, res) => {
	
	try {
		
		
		const [order] = await ordersController.getAllOrders({id: req.params.id}, {withItems: true})
		logMessage(`order retrieved successful`)

		res.success(order, 'consult proceed successful.')

	} catch (error) {
		res.error(500, error, 'Failure on getting order')
	}
});


export default router;