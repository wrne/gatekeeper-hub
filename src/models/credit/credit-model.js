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
export async function searchAllLimits(filters, pageNumber, pageSize) {

	const conn = new dbConn()
	
	const fields = ['GRUPO_ECONOMICO', 'MOEDA', 'LIMITE_TOTAL','TOTAL_CONSUMIDO','SALDO_LIMITE_ATUAL']
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


export async function getGuarantees(filter) {


	const conn = new dbConn()
	let safraAtual = ''
	
	// Definindo safra atual para filtro caso não tenha sido informada via parametro
	if (!filter.safra) {

		const today = new Date()

		if (today.getMonth() >= 6)
			safraAtual = `${today.getFullYear()}/${today.getFullYear() + 1}`
		else
			safraAtual = `${today.getFullYear() - 1}/${today.getFullYear()}`

	}

	const groups = filter.groups.map(group => `'${group}'`).join(',')

	// bUsca todas as garantias calculando o valor considerado atualmente de acordo com o status.
	const queryStt = `
	select SUM(ZZ2_VALOR*X6_CONTEUD/100) VALOR_CONSIDERADO, ZZ2_STATUS STATUS, ZZ2_TPREG TIPO_GARANTIA, ZZ2_GRPVEN GRUPO_ECONOMICO 
	  from ZZ2010 ZZ2
	 inner join SX6010 SX6
	    on SX6.D_E_L_E_T_ = ''
	   and X6_VAR = 'MV_XPGST'+ZZ2_STATUS
	 where ZZ2.D_E_L_E_T_ = ''
	   and ZZ2_GRPVEN in (${groups})
	   and ZZ2_SAFRA = '${safraAtual}'
	 group by X6_CONTEUD,ZZ2_STATUS, ZZ2_TPREG, ZZ2_GRPVEN
	having SUM(ZZ2_VALOR*X6_CONTEUD/100) > 0


	union

	Select VALOR , '', TIPO,  ZZH_GRPVEN
	  from ZZH010 t
	 CROSS APPLY (
		VALUES
			('CLE', t.ZZH_LIMCLE),
			('EXC', iif(ZZH_LIMMAN>0 And ZZH_VIGTMP>Convert(VARCHAR(8),getDate(),112),ZZH_LIMMAN,0 ))
	) v(TIPO, VALOR)
	Where D_E_L_E_T_ = ''
	  and ZZH_GRPVEN in (${groups})
	  and ZZH_SAFRA = '${safraAtual}'
	  and ZZH_MSBLQL <> '1'

	order by ZZ2_GRPVEN, ZZ2_TPREG, ZZ2_STATUS
	`

	const resultQuery = await conn.query(queryStt)

	return remapObject(resultQuery, mappingDBFieldsCredit)

}

export async  function getMappingGuaranteesTypes() {

	const conn = new dbConn()
	const params = {
		fields: ['X5_CHAVE', 'X5_DESCRI'],
		table: 'SX5010',
		where: {X5_TABELA: 'XG', D_E_L_E_T_: '', X5_FILIAL: ''},
		orderBy: 'X5_CHAVE',
		pageSize: 100
	}

	const listGuaranteesType = await conn.buildQuery(params)
	let newMapping = {}
	listGuaranteesType.forEach(type => {
		newMapping[type.X5_CHAVE.trim()] = type.X5_DESCRI.trim()
	});

	newMapping['CLE'] = 'Clean'
	newMapping['EXC'] = 'Exception'
	return newMapping
}

