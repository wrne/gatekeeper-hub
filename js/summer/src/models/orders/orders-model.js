import dbConn from "../../infra/db/database-connection.js";
import remapObject from "../../utils/remap-fields-obj.js";
import {mappingDBFieldsOrders} from '../../controllers/orders/orders-adapter.js'

/**
 * Busca todos os pré-pedidos de venda de acordo com os filtros informados
 * @param {Object} filters Objeto com os filtros para a consulta no formato {campo: valor}
 * @param {Boolean} withItems Informa se o retorno deve informar os itens do pedido
 * @param {Number} pageNumber Número da pagina da consulta
 * @param {Number} pageSize Quantos registros serão retornados na página
 * @returns Array de objetos com a listagem dos pedidos
 */
async function searchAllOrders(filters, withItems, pageNumber, pageSize) {

	const conn = new dbConn()
	const D_E_L_E_T_ = ''
	const fields = ['Z2_NUM', 'Z2_EMISSAO', 'Z2_CLIENTE']
	const returnWithItems = !!withItems


	filters = {
		...filters,
		... { D_E_L_E_T_ }
	}

	const params = {
		fields,
		table: 'SZ2010',
		where: filters,
		orderBy: 'Z2_NUM',
		pageNumber,
		pageSize
	}


	if (!returnWithItems){

		const resultOrdersQuery = await conn.buildQuery(params)

		return remapObject(resultOrdersQuery, mappingDBFieldsOrders)

	} else {
		const resultOrdersQuery = await conn.buildQuery(params)

		const ordersNumbers = resultOrdersQuery.map(order => `'${order.Z2_NUM}'`).join(',')
		const queryStt = `
			Select Z2_NUM, Z2_EMISSAO, Z2_CLIENTE,Z2_LOJACLI, Z3_ITEM, Z3_PRODUTO, Z3_QTDVEN, Z3_VALOR
			  From SZ2010 SZ2
			 Inner join SZ3010 SZ3
			    On SZ2.Z2_NUM = SZ3.Z3_NUM
			 Where SZ2.Z2_NUM in (${ordersNumbers})
			   and Z3_BLQ Not in ('C','R','S')
			   and SZ2.D_E_L_E_T_ = ''
			   and SZ3.D_E_L_E_T_ = ''
			 Order by Z2_NUM, Z3_ITEM
		`

		const resultQuery = await conn.query(queryStt)

		let orders = []
		let actualOrder = ''

		// Trata formato do objeto de retorno
		resultQuery.forEach(item => {
			if (actualOrder !== item.Z2_NUM) {
				actualOrder = item.Z2_NUM
				orders.push({
					orderNumber: item.Z2_NUM,
					emitDate: item.Z2_EMISSAO,
					customerId: item.Z2_CLIENTE,
					customerStore: item.Z2_LOJACLI,
					items: [{
						product: item.Z3_PRODUTO,
						amout: item.Z3_QTDVEN, 
						value: item.Z3_VALOR
					}]
				})
			} else {
				orders[orders.length - 1].items.push({
					product: item.Z3_PRODUTO,
					amout: item.Z3_QTDVEN, 
					value: item.Z3_VALOR
				});
			}

		})

		return orders

	}
}

export default { searchAllOrders }