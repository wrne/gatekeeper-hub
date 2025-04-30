import {searchAllOrders, validateNewOrderData} from '../../models/orders/orders-model.js'
import {mappingFieldsOrders} from './orders-adapter.js'
import { publish } from "../../infra/queue/queue-manager.js"

async function getAllOrders(filter, params = {}) {

	const pageNumber = (!filter.page ? 1 : filter.page)
	const pageSize = (!filter.pageSize ? 10 : filter.pageSize)

	const filters = {};
	
	// Retorna um obj com o De/Para de campos entre o filtro da API e o Protheus  
	const mappingFields = Object.entries(mappingFieldsOrders); 

	mappingFields.forEach(([fieldReq, fieldProtheus]) => {

		// Se um campo mapeado for enviado como parâmetro, ele é adicionado ao filtro
		if (filter[fieldReq])
			filters[fieldProtheus] = filter[fieldReq];

	});

	const withItems = params.withItems || false

	return searchAllOrders(filters,withItems, pageNumber, pageSize)

}

async function putNewOrder(origin, data){

	if (origin === 'agrega') {

		const{ order: orderData, payment: paymentData} = data

		// Valida dados do pedido enviados
		await validateNewOrderData(orderData)

		// Publica dados do pedido na fila de pedido da agrega
		await publish(process.ccab_conecta.exchanges.QUEUE_ORDERS,'agrega_orders',orderData)
		
		// Publica dados do pagamento na fila pagamentos da agrega
		await publish(process.ccab_conecta.exchanges.QUEUE_ORDERS,'agrega_payments',paymentData)

	}
	
}

export default { getAllOrders,putNewOrder }