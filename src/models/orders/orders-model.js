import dbConn from "../../infra/db/database-connection.js";
import remapObject from "../../utils/remap-fields-obj.js";
import {mappingDBFieldsOrders} from '../../controllers/orders/orders-adapter.js'

import {ProtheusDate} from "../../utils/protheus-utils.js";

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
		if (!ordersNumbers)
			return []

		
		const queryStt = `
			Select Z2_NUM, 
				   Z2_EMISSAO, 
				   Z2_CLIENTE,
				   Z2_LOJACLI, 
				   Z2_VEND2, 
				   Z2_VEND3, 
				   Z2_CONDPAG, 
				   Z2_MOEDA, 
				   E4_DESCRI,
				   A1_NOME, 
				   A1_COMPLEM, 
				   A1_INSCR, 
				   A1_END,
				   A1_CGC,
				   Z3_ITEM, 
				   Z3_PRODUTO,
				   B1_DESC,
				   B1_XPREPRO,
				   Z3_QTDVEN, 
				   Z3_VALOR
			  From SZ2010 SZ2
			 Inner join SZ3010 SZ3
			    On SZ2.Z2_NUM = SZ3.Z3_NUM
			 Inner join SB1010 SB1
			    on B1_COD = Z3_PRODUTO
			 Inner join SA1010 SA1
			    On SZ2.Z2_CLIENTE = SA1.A1_COD
			   and SZ2.Z2_LOJACLI = SA1.A1_LOJA
			 Inner join SE4010 SE4
			    On SZ2.Z2_CONDPAG = SE4.E4_CODIGO
			 Inner join SA3010 SA3_SEG
			    ON SZ2.Z2_VEND2 = SA3_SEG.A3_COD
			 Inner join SA3010 SA3_VEND
			    ON SZ2.Z2_VEND2 = SA3_VEND.A3_COD
			 Where SZ2.Z2_NUM in (${ordersNumbers})
			   and Z3_BLQ Not in ('C','R','S')
			   and SZ2.D_E_L_E_T_ = ''
			   and SZ3.D_E_L_E_T_ = ''
			   and SA1.D_E_L_E_T_ = ''
			   and SA3_SEG.D_E_L_E_T_ = ''
			   and SA3_VEND.D_E_L_E_T_ = ''
			   and SE4.D_E_L_E_T_ = ''
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
					customerName: item.A1_NOME,
					customerFarm: item.A1_COMPLEM,
					customerAddress: item.A1_END,
					customerStateRegistration: item.A1_INSCR,
					customerNationalRegistration: item.A1_CGC,
					customerSegment: item.Z2_VEND2,
					seller: item.Z2_VEND3,
					paymentConditionCode: item.Z2_CONDPAG,
					paymentConditionDescription: item.E4_DESCRI,
					currencyCode: item.Z2_MOEDA,
					currencyDescription: (item.Z2_MOEDA == 1 ? 'BRL' : 'USD'), // TODO: Implementar dicionário de moedas
					totalOrder: item.Z3_VALOR,
					items: [{
						product: item.Z3_PRODUTO,
						productDescription: item.B1_DESC,
						productPackage: item.B1_XPREPRO,
						amout: item.Z3_QTDVEN, 
						value: item.Z3_VALOR
					}]
				})
			} else {
				orders[orders.length - 1].totalOrder += item.Z3_VALOR
				orders[orders.length - 1].items.push({
					product: item.Z3_PRODUTO,
					productDescription: item.B1_DESC,
					productPackage: item.B1_XPREPRO,
					amout: item.Z3_QTDVEN, 
					value: item.Z3_VALOR
				});
			}

		})

		return orders

	}
}

/**
 * Valida os dados de um novo pedido de venda antes de ser aceito na base para processamento pelo Protheus.
 * Caso algum dado esteja inválido, uma exceção será lançada com a descrição da falha identificada.
 * @param {Object} data Objeto com os dados do pedido candidato a ser inserido
 * @param {string} data.customerId Código do cliente no Protheus
 * @param {string} data.customerStore Loja do cliente no Protheus
 * @param {string} data.priceTable Código da Tabela de Preço
 * @param {string} data.paymentCondition Código da condição de pagamento
 * @param {string} data.dueDate Data de vencimento do pedido
 * @param {Array<Object>} data.items Array de itens do pedido
 * @param {string} data.items.item Item do pedido
 * @param {string} data.items.product Código do produto
 * @param {integer} data.items.quantity Quantidade solicitada
 */
async function validateNewOrderData(data){

	const {priceTable, customerId, customerStore, paymentCondition, dueDate, items} = data
	const D_E_L_E_T_ = ''
	const hoje = ProtheusDate(new Date())
	
	// -------------------------------------------------------------------------
	// Valida informações obrigatórias
	// -------------------------------------------------------------------------
	const requiredInfo = []

	if (!priceTable || priceTable.length == 0 )
		requiredInfo.push('Price table')
	
	if (!customerId || customerId.length == 0 )
		requiredInfo.push('Customer ID')
	
	if (!customerStore || customerStore.length == 0 )
		requiredInfo.push('Customer store')
	
	if (!paymentCondition || paymentCondition.length == 0 )
		requiredInfo.push('Payment condition')
	
	if (!items || items.length == 0)
		requiredInfo.push('items')
	
	
	if (requiredInfo.length > 0)
		throw new Error(`Missing required information: ${requiredInfo.join(',')}`)
	
	
	// -------------------------------------------------------------------------
	// Valida se dados são válidos (existem na base e estão ativos)
	// -------------------------------------------------------------------------

	// Valida se cliente está ativo --------------------------------------------
	let filters = {
		A1_COD: customerId,
		A1_LOJA: customerStore,
		A1_MSBLQL: {
			operator: '<>',
			value: '1'
		},
		... { D_E_L_E_T_ }
	}

	const resultCustomerQry = await validaRegAtivo('SA1010', filters)

	if (resultCustomerQry.length == 0)
		requiredInfo.push('Customer')


	// Valida se tabela de preços está ativa -----------------------------------
	filters = {
		DA0_CODTAB: priceTable,
		DA0_ATIVO: '1',	
		DA0_DATDE: {
			operator: '<=',
			value: hoje
		},
		DA0_DATATE: {
			operator: '>=',
			value: hoje
		},
		DA0_XDECAR: {
			operator: '<=',
			value: hoje
		},
		DA0_XATECA: {
			operator: '>=',
			value: hoje
		},
		... { D_E_L_E_T_ }
	}

	const resultPriceTableQry = await validaRegAtivo('DA0010', filters)

	if (resultPriceTableQry.length == 0)
		requiredInfo.push('Price table')

	// Valida se condição de pagamento está ativa ------------------------------
	filters = {
		E4_CODIGO: paymentCondition,
		E4_MSBLQL: {
			operator: '<>',
			value: '1'
		},
		... { D_E_L_E_T_ }
	}

	const resultPaymentCondrQry = await validaRegAtivo('SE4010', filters, ['E4_CODIGO','E4_TIPO'])

	if (resultPaymentCondrQry.length == 0)
		requiredInfo.push('Payment condition')
	else
		if (resultPaymentCondrQry[0].E4_TIPO === '9' && (!dueDate || dueDate.length == 0))
			requiredInfo.push('Due Date')

	
	if (requiredInfo.length > 0)
		throw new Error(`${requiredInfo.join(', ')} not found or inactive`)


	// -------------------------------------------------------------------------
	// Valida produtos informados estão ativos ---------------------------------
	// -------------------------------------------------------------------------
	const products = [...new Set(items.map(item => item.product))]
	
	filters = {
		B1_COD: {
			operator: 'In',
			value: products
		},
		B1_MSBLQL: {
			operator: '<>',
			value: '1'
		},
		... { D_E_L_E_T_ }
	}
	
	const conn = new dbConn()

	const params = {
		fields: ['B1_COD','B1_MSBLQL','B1_CONV'] ,
		table: 'SB1010',
		where: filters,
		orderBy: 'R_E_C_N_O_',
		paged: false
	}

	const resultProductQry = await conn.buildQuery(params) //await validaRegAtivo('SB1010', filters)
	
	// Quantidade informada bate com a embalagem do produto --------------------
	const itemsBroken = []
		
	for (const item of items) {
		
		if (!resultProductQry.find(prod => prod.B1_COD == item.product)){

			itemsBroken.push({item: item.product, message: 'Product not found or inactive'});
			continue;
		}

		if (item.quantity % resultProductQry.find(prod => prod.B1_COD == item.product).B1_CONV != 0)
			itemsBroken.push({item: item.item, message: 'Requested quantity does not match the product packaging'})

	}

	if (itemsBroken.length > 0)
		throw new Error(`Invalid items: ${itemsBroken.map(item => `${item.item} - ${item.message}`).join(',')}`)

	// Valida disponibilidade dos produtos
	

}

async function validaRegAtivo(table, filters, fields = ['1']){

	const conn = new dbConn()

	const params = {
		fields ,
		table ,
		where: filters,
		orderBy: 'R_E_C_N_O_'
	}

	return await conn.buildQuery(params)

}

export  { searchAllOrders, validateNewOrderData }