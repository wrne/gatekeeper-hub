import express from "express";
import ordersController from "../../controllers/orders/orders-controller.js"

import { logMessage } from "../../utils/log-generator.js";

const router = express.Router();

/**
 * Rota de Consulta de pedidos - Listagem de acordo com os filtros
 */
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

/**
 * Rota de Consulta de pedidos - Listagem de acordo com os filtros
 */
router.get('/orders/items', async (req, res) => {
	
	try {
		logMessage(`Requisition: /orders Params: ${JSON.stringify(req.query)}`)
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
router.get('/orders/:id', async (req, res) => {
	
	try {
		
		logMessage(`Requisition: /orders Params: ${JSON.stringify(req.params)}`)
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
router.get('/orders/:id/items', async (req, res) => {
	
	try {
		
		logMessage(`Requisition: /orders Params: ${JSON.stringify(req.params)}`)
		const [order] = await ordersController.getAllOrders({id: req.params.id}, {withItems: true})
		logMessage(`order retrieved successful`)

		res.success(order, 'consult proceed successful.')

	} catch (error) {
		res.error(500, error, 'Failure on getting order')
	}
});


export default router;