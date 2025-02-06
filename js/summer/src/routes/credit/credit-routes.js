import express from "express";
import {getAllLimits} from "../../controllers/credit/credit-controller.js"

import { logMessage } from "../../utils/log-generator.js";

const router = express.Router();

/**
 * Rota de Consulta de limites de crédito - Listagem de acordo com os filtros
 */
router.get('/', async (req, res) => {
	
	try {
		
		const creditList = await getAllLimits(req.query)
		logMessage(`Credit Limit retrieved successful`)

		res.success(creditList, 'consult proceed successful.')


	} catch (error) {
		res.error(500, error, 'Failure on getting credit limit')
	}

});


/**
 * Rota de Consulta de limite de credito por ID do grupo economico
 */
router.get('/:grupo', async (req, res) => {
	
	try {
		
		const [credit] = await getAllLimits({group: req.params.grupo,...req.query})
		logMessage(`credit retrieved successful`)

		res.success(credit, 'consult proceed successful.')

	} catch (error) {
		res.error(500, error, 'Failure on getting credit')
	}
});



export default router;