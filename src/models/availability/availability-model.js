import dbConn from "../../infra/db/database-connection.js";

/**
 * Busca todos os limites de crédito atuais de acordo com os filtros informados
 * @param {Object} filters Objeto com os filtros para a consulta no formato {campo: valor}
 * @param {Number} pageNumber Número da pagina da consulta
 * @param {Number} pageSize Quantos registros serão retornados na página
 * @returns Array de objetos com a listagem dos limites por grupo econômico
 */
async function getAvailability(filter) {

	const conn = new dbConn('bi')
	const paramsSP = {
		name: 'sp_ConsultaDisponibilidade',
		params: filter
	}
	const DBResult = await conn.execSP(paramsSP)

	let oldPackage = ''
	let availabilityResult = []
	
	DBResult.forEach(item => {
		if (oldPackage !== item.codigo){
			oldPackage = item.codigo
			availabilityResult.push( {
				product: item.codigo,
				availability: []
			})
		}

		availabilityResult[availabilityResult.length-1].availability.push (
			{
				filial: item.filial,
				mes_1: item.mes_1,
				mes_2: item.mes_2,
				mes_3: item.mes_3,
				mes_4: item.mes_4,
				mes_5: item.mes_5,
				mes_6: item.mes_6,
				mes_7: item.mes_7,
				mes_8: item.mes_8,
				mes_9: item.mes_9,
				mes_10: item.mes_10,
				mes_11: item.mes_11,
				mes_12: item.mes_12
			}
		)
	});

	return availabilityResult
	// return remapObject(availabilityResult, mappingDBFieldsStocks)

}

export default { getAvailability }