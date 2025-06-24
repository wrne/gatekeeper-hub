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
	Z2_VEND2: "segment",
	Z2_VEND3: "seller",
	A1_NOME: "customerName",
	A1_CGC: "customerDocument",
	A1_END: "customerDeliveryAddress",
	A1_ENDC: "customerFinanceAddress",
	Z2_CONDPAG: "paymentConditionCode",
	Z2_MOEDA: "currencyCode",
	Z3_PRODUTO: "product",
	B1_DESCRI: "productDescription",
	B1_XPREPRO: "productPackage",
	Z3_QTDVEN: "amout", 
	Z3_VALOR: "value"
}

// currency_description: order.currencyDescription

export {mappingFieldsOrders , mappingDBFieldsOrders}