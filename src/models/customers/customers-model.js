import dbConn from "../../infra/db/database-connection.js";
import remapObject from "../../utils/remap-fields-obj.js";
import { mappingDBFieldsCustomers } from '../../controllers/customers/customers-adapter.js'

/**
 * Busca todos os pagamentos de aberto de acordo com os filtros informados
 * @param {Object} filters Objeto com os filtros para a consulta no formato {campo: valor}
 * @param {Number} pageNumber Número da pagina da consulta
 * @param {Number} pageSize Quantos registros serão retornados na página
 * @returns Array de objetos com a listagem dos pagamentos em aberto
 */
async function searchAllCustomers(filters, pageNumber, pageSize) {

	const conn = new dbConn()
	const D_E_L_E_T_ = ''
	const A1_MSBLQL = {
		value: '1',
		operator: '<>'
	}
	
	const fields = ['A1_COD','A1_LOJA','A1_NOME','A1_PESSOA','A1_CGC','A1_INSCR','A1_EST','A1_MUN','A1_GRPVEN','A1_COMPLEM','A1_EMAIL']
	
	
	filters = {
		...filters,
		... { D_E_L_E_T_ },
		... { A1_MSBLQL }
	}

	const params = {
		fields,
		table: 'SA1010',
		where: filters,
		orderBy: 'A1_COD, A1_LOJA',
		pageNumber,
		pageSize
	}

	let result = {}
	const queryResult = await conn.buildQuery(params)
	const remappedResult = remapObject(queryResult, mappingDBFieldsCustomers)
	if (!filters.A1_COD){

		const totalPages =  await conn.getTotalPages(params)
		result = {customers: remappedResult, totalPages}
		
	} else {
		
		result = remappedResult
	}

	return result 

}

export default { searchAllCustomers }