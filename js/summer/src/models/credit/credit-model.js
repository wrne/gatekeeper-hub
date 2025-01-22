import dbConn from "../../infra/db/database-connection.js";
import remapObject from "../../utils/remap-fields-obj.js";
import { mappingDBFieldsCredit } from '../../controllers/credit/credit-adapter.js'

/**
 * Busca todos os limites de crédito atuais de acordo com os filtros informados
 * @param {Object} filters Objeto com os filtros para a consulta no formato {campo: valor}
 * @param {Number} pageNumber Número da pagina da consulta
 * @param {Number} pageSize Quantos registros serão retornados na página
 * @returns Array de objetos com a listagem dos limites por grupo econômico
 */
async function searchAllLimits(filters, pageNumber, pageSize) {

	const conn = new dbConn()
	
	const fields = ['GRUPO_ECONOMICO', 'MOEDA', 'SALDO_LIMITE_ATUAL']
	let safraAtual = ''
	
	// Definindo safra atual para filtro caso não tenha sido informada via parametro
	if (!filters.SAFRA) {

		const today = new Date()

		if (today.getMonth() >= 6)
			safraAtual = `${today.getFullYear()}/${today.getFullYear() + 1}`
		else
			safraAtual = `${today.getFullYear() - 1}/${today.getFullYear()}`


		filters = {
			...filters,
			SAFRA: safraAtual,
		}
	}

	const params = {
		fields,
		table: 'Credit_actualLimit',
		where: filters,
		orderBy: 'GRUPO_ECONOMICO',
		pageNumber,
		pageSize
	}

	const creditLimitResult = await conn.buildQuery(params)

	return remapObject(creditLimitResult, mappingDBFieldsCredit)

}

export default { searchAllLimits }