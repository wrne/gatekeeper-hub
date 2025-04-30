import dbConn from "../../infra/db/database-connection.js";
import remapObject from "../../utils/remap-fields-obj.js";
import { mappingDBFieldsProducts } from '../../controllers/products/products-adapter.js'

/**
 * Busca todos os pagamentos de aberto de acordo com os filtros informados
 * @param {Object} filters Objeto com os filtros para a consulta no formato {campo: valor}
 * @param {Number} pageNumber Número da pagina da consulta
 * @param {Number} pageSize Quantos registros serão retornados na página
 * @returns Array de objetos com a listagem dos pagamentos em aberto
 */
async function searchAllProducts(filters, pageNumber, pageSize) {

	const conn = new dbConn()
	const D_E_L_E_T_ = ''
	const B1_MSBLQL = {
		value: '1',
		operator: '<>'
	}
	
	const fields = ['B1_COD','B1_DESC','B5_XPRINCI','ZZ3_DESCPR','B1_XPREPRO','B1_CONV','B1_PE','B1_GRUPO','BM_DESC']
	
	
	filters = {
		...filters,
		... { D_E_L_E_T_ },
		... { B1_MSBLQL }
	}

	const params = {
		fields,
		table: 'SB1010',
		join: [
			{
				table: 'SB5010',
				type: 'inner',
				on: {
					B1_COD: 'B5_COD',
				}
			},
			{
				table: 'ZZ3010',
				type: 'inner',
				on: {
					B5_XPRINCI: 'ZZ3_COD',
				}
			},
			{
				table: 'SBM010',
				type: 'inner',
				on: {
					B1_GRUPO: 'BM_GRUPO',
				}
			}
		],
		where: filters,
		orderBy: 'B1_COD',
		pageNumber,
		pageSize
	}

	let result = {}
	const queryResult = await conn.buildQuery(params)
	const remappedResult = remapObject(queryResult, mappingDBFieldsProducts)
	if (!filters.B1_COD){

		const totalPages =  await conn.getTotalPages(params)
		result = {products: remappedResult, totalPages}
		
	} else {
		
		result = remappedResult
	}

	return result 

}

export { searchAllProducts }