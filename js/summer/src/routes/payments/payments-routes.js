import express from "express";
import {getAllPayments} from "../../controllers/payments/payments-controller.js"

import { logMessage } from "../../utils/log-generator.js";

const router = express.Router();
/**
 * Rota de Consulta de Pagamentos - Listagem de acordo com os filtros
 */
router.get('/', async (req, res) => {
	
	try {
		
		const paymentsList = await getAllPayments(req.query)
		logMessage(`payments list retrieved successful`)

		res.success(paymentsList, 'consult proceed successful.')


	} catch (error) {
		res.error(500, error, 'Failure on getting payments lists')
	}

});


/**
 * Rota de Consulta de pagamentos por ID do cliente
 */
router.get('/:client', async (req, res) => {
	
	try {
		
		const payments = await getAllPayments({clientId: req.params.client,...req.query})
		logMessage(`payments retrieved successful`)

		res.success(payments, 'consult proceed successful.')

	} catch (error) {
		res.error(500, error, 'Failure on getting payments')
	}
});



export default router;