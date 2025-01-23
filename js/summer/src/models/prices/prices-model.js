import dbConn from "../../infra/db/database-connection.js";
import remapObject from "../../utils/remap-fields-obj.js";
import {mappingDBFieldsPrice} from '../../controllers/prices/prices-adapter.js'

/**
 * Busca as tabelas de preços e seus itens de acordo com os filtros informados
 * @param {Object} filters Objeto com os filtros para a consulta no formato {campo: valor}
 * @param {Boolean} withItems Informa se o retorno deve informar os itens da tabela de preço
 * @param {Number} pageNumber Número da pagina da consulta
 * @param {Number} pageSize Quantos registros serão retornados na página
 * @returns Array de objetos com a listagem das tabelas
 */
async function searchAllPrices(filters, withItems, pageNumber, pageSize) {

	const conn = new dbConn()
	const fields = ['CODIGO_TABELA','DESCRICAO','SAFRA']
	const returnWithItems = !!withItems

	const params = {
		fields,
		table: 'active_price_tables',
		where: filters,
		orderBy: 'CODIGO_TABELA',
		pageNumber,
		pageSize
	}

	if (!returnWithItems){

		const resultOrdersQuery = await conn.buildQuery(params)

		return remapObject(resultOrdersQuery, mappingDBFieldsPrice)

	} else {

		const resultPriceTableQuery = await conn.buildQuery(params)

		const tables = resultPriceTableQuery.map(table => `'${table.CODIGO_TABELA}'`).join(',')
		const queryStt = `
			Select CODIGO_TABELA, DESCRICAO, SAFRA, DA1_ITEM, DA1_CODPRO, DA1_PRCVEN, iif(DA1_MOEDA = '1', 'BRL','USD') DA1_MOEDA
			  From active_price_tables DA0
			 Inner join DA1010 DA1
			    On CODIGO_TABELA = DA1_CODTAB
			 Where CODIGO_TABELA in (${tables})
			   and DA1_ATIVO = '1'
   			   and DA1.D_E_L_E_T_ = ''
			 Order by CODIGO_TABELA, DA1_ITEM
		`

		const resultQuery = await conn.query(queryStt)

		let priceTables = []
		let actualTable = ''

		// Trata formato do objeto de retorno
		resultQuery.forEach(item => {
			if (actualTable !== item.CODIGO_TABELA) {

				actualTable = item.CODIGO_TABELA
			
				priceTables.push({
					id: item.CODIGO_TABELA,
					description: item.DESCRICAO,
					crop: item.SAFRA,
					items: [{
						item: item.DA1_ITEM,
						product: item.DA1_CODPRO,
						price: item.DA1_PRCVEN,
						currency: item.DA1_MOEDA
					}]
				})
			} else {
				priceTables[priceTables.length - 1].items.push({
					item: item.DA1_ITEM,
					product: item.DA1_CODPRO,
					price: item.DA1_PRCVEN,
					currency: item.DA1_MOEDA
				});
			}

		})

		return priceTables

	}
}


/**
 * Busca o preço de um unico produto de uma determinada tabela de preço de acordo com os filtros informados
 * @param {Object} filters Objeto com os filtros para a consulta no formato {campo: valor}
 * @param {Number} pageNumber Número da pagina da consulta
 * @param {Number} pageSize Quantos registros serão retornados na página
 * @returns Array de objetos com a listagem das tabelas
 */
async function searchProductPrice({product, table}) {

	const conn = new dbConn()
	const fields = ['DA1_CODTAB','DA1_CODPRO','DA1_PRCVEN','DA1_MOEDA']
	const filters = {
		DA1_CODPRO: product,
		DA1_CODTAB: table
	}	

	const params = {
		fields,
		table: 'DA1010',
		where: filters,
		orderBy: 'DA1_CODTAB,DA1_CODPRO'
	}


	const resultOrdersQuery = await conn.buildQuery(params)

	return remapObject(resultOrdersQuery, mappingDBFieldsPrice)

}

export default { searchAllPrices, searchProductPrice }