import express from "express";
import {getAllCustomers} from "../../controllers/customers/customers-controller.js"

import { logMessage } from "../../utils/log-generator.js";

const router = express.Router();

/**
 * Rota de Consulta de Clientes - Listagem de acordo com os filtros
 */
router.get('/', async (req, res) => {
	
	try {
		
		const customersList = await getAllCustomers(req.query)
		logMessage(`customers list retrieved successful`)

		res.success(customersList, 'consult proceed successful.')


	} catch (error) {
		res.error(500, error, 'Failure on getting customers lists')
	}

});


/**
 * Rota de Consulta de clientes por ID
 */
router.get('/:id', async (req, res) => {
	
	try {
		const id = req.params.id.slice(0,6)
		const store = req.params.id.slice(6)		

		const [customers] = await getAllCustomers({id, store})
		logMessage(`customers retrieved successful`)

		res.success(customers, 'consult proceed successful.')

	} catch (error) {
		res.error(500, error, 'Failure on getting customers')
	}
});



export default router;