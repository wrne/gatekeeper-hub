import dbConn from "../../infra/db/database-connection.js";
import remapObject from "../../utils/remap-fields-obj.js";
import { mappingDBFieldsPayments } from '../../controllers/payments/payments-adapter.js'

/**
 * Busca todos os pagamentos de aberto de acordo com os filtros informados
 * @param {Object} filters Objeto com os filtros para a consulta no formato {campo: valor}
 * @param {Number} pageNumber Número da pagina da consulta
 * @param {Number} pageSize Quantos registros serão retornados na página
 * @returns Array de objetos com a listagem dos pagamentos em aberto
 */
async function searchAllPayments(filters, pageNumber, pageSize) {

	const conn = new dbConn()
	const D_E_L_E_T_ = ''
	
	const fields = ['E1_NUM','E1_PARCELA','E1_TIPO','E1_CLIENTE','E1_LOJA','E1_EMISSAO','E1_VENCREA','E1_SALDO','E1_MOEDA','E1_HIST','E1_XGRUCLI','E1_XGRUDES']

	
	filters = {
		...filters,
		... { D_E_L_E_T_ }
	}

	const params = {
		fields,
		table: 'SE1010',
		where: filters,
		orderBy: 'E1_NUM',
		pageNumber,
		pageSize
	}

	const result = await conn.buildQuery(params)

	return remapObject(result, mappingDBFieldsPayments)

}

export default { searchAllPayments }