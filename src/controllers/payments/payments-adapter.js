const mappingFieldsPayments = {
	type: 'E1_TIPO',
	clientId: 'E1_CLIENTE',
	clientStore: 'E1_LOJA',
	issueDate: 'E1_EMISSAO',
	dueDate: 'E1_VENCREA',
	economicGroup: 'E1_XGRUCLI',
}

const mappingDBFieldsPayments = {
	E1_NUM: 'documentNumber',
	E1_PARCELA: 'parcel',
	E1_TIPO: 'type',
	E1_CLIENTE: 'clientId',
	E1_LOJA: 'clientStore',
	E1_EMISSAO: 'issueDate',
	E1_VENCREA: 'dueDate',
	E1_SALDO: 'balance',
	E1_MOEDA: 'currency',
	E1_HIST: 'description',
	E1_XGRUCLI: 'economicGroup', 
	E1_XGRUDES: 'economicGroupDescription'
}

export {mappingFieldsPayments , mappingDBFieldsPayments}