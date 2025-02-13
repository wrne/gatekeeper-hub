const mappingFieldsOrders = {
	emitDate: "Z2_EMISSAO",
	client: "Z2_CLIENTE",
	orderNumber: "Z2_NUM",
	priceTable: "Z2_TABELA",
	id: "Z2_NUM"
}

const mappingDBFieldsOrders = {
	Z2_NUM: "orderNumber",
	Z2_EMISSAO: "emitDate",
	Z2_CLIENTE: "customerId",
	Z2_LOJACLI: "customerStore",
	Z3_PRODUTO: "product",
	Z3_QTDVEN: "amout", 
	Z3_VALOR: "value"
}

export {mappingFieldsOrders , mappingDBFieldsOrders}