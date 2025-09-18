import express from "express";
import {getAvailabilityController} from "../../controllers/availability/availability-controller.js"

import { logMessage } from "../../utils/log-generator.js";

const router = express.Router();

/**
 * Rota de Consulta de Disponibilidade - POr Embalagem e por Filial
 * @param {String} produtos - Lista de produtos separados por ponto e vírgula
 */
router.get('/package/branch', async (req, res) => {
	
	try {
		// const products = req.query.products.split(',').map((product) => product.trim())
		const availabilityList = await getAvailabilityController({produtos: req.query.products, tipo: 'alias_pre_filial'})
		logMessage(`availability list retrieved successful`)

		res.success(availabilityList, 'consult proceed successful.')


	} catch (error) {
		res.error(500, error, 'Failure on getting availability lists')
	}

});

/**
 * Rota de Consulta de Disponibilidade - POr Embalagem e por Filial
 * @param {String} produtos - Lista de produtos separados por ponto e vírgula
 */
router.get('/package', async (req, res) => {
	
	try {
		// const products = req.query.products.split(',').map((product) => product.trim())
		const availabilityList = await getAvailabilityController({produtos: req.query.products, tipo: 'alias_pre'})
		logMessage(`availability list retrieved successful`)

		res.success(availabilityList, 'consult proceed successful.')


	} catch (error) {
		res.error(500, error, 'Failure on getting availability lists')
	}

});



export default router;