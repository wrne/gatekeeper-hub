import express from "express";
import {getAllProducts} from "../../controllers/products/products-controller.js"

import { logMessage } from "../../utils/log-generator.js";

const router = express.Router();

/**
 * Rota de Consulta de Produtos - Listagem de acordo com os filtros
 */
router.get('/', async (req, res) => {
	
	try {
		
		const productsList = await getAllProducts(req.query)
		logMessage(`products list retrieved successful`)

		res.success(productsList, 'consult proceed successful.')


	} catch (error) {
		res.error(500, error, 'Failure on getting products lists')
	}

});


/**
 * Rota de Consulta de produtos por ID
 */
router.get('/:id', async (req, res) => {
	
	try {

		const products = await getAllProducts(req.params.id)
		logMessage(`product retrieved successful`)

		res.success(products, 'consult proceed successful.')

	} catch (error) {
		res.error(500, error, 'Failure on getting products')
	}
});



export default router;