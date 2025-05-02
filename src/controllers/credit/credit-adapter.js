const mappingFieldsCredit = {
	crop: "SAFRA",
	group: "GRUPO_ECONOMICO",
}

const mappingDBFieldsCredit = {
	GRUPO_ECONOMICO: 'group', 
	MOEDA: 'currency', 
	SALDO_LIMITE_ATUAL: 'availableLimit',
	LIMITE_TOTAL: 'totalLimit',
	TOTAL_CONSUMIDO: 'totalConsumed',
	VALOR_CONSIDERADO: 'totalCredit',
	STATUS: 'status',
	TIPO_GARANTIA: 'type'
}

export {mappingFieldsCredit , mappingDBFieldsCredit}