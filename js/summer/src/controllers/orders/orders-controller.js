import ordersModel from '../../models/orders/orders-model.js'
import mappingFieldsOrders from './orders-adapter.js'

async function getAllOrders(params) {

	const pageNumber = (!params.page ? 1 : params.page)
	const pageSize = (!params.pageSize ? 10 : params.pageSize)

	const filters = {};
	
	// Retorna um obj com o De/Para de campos entre o filtro da API e o Protheus  
	const mappingFields = Object.entries(mappingFieldsOrders); 

	mappingFields.forEach(([fieldReq, fieldProtheus]) => {

		// Se um campo mapeado for enviado como parâmetro, ele é adicionado ao filtro
		if (params[fieldReq])
			filters[fieldProtheus] = params[fieldReq];

	});

	return ordersModel.searchAllOrders(filters, pageNumber, pageSize)

}

export default { getAllOrders }