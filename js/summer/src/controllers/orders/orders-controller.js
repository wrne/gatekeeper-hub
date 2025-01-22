import ordersModel from '../../models/orders/orders-model.js'
import {mappingFieldsOrders} from './orders-adapter.js'

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

	return ordersModel.searchAllOrders(filters,withItems, pageNumber, pageSize)

}


export default { getAllOrders }