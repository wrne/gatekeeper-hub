import customersModel from '../../models/customers/customers-model.js'
import {mappingFieldsCustomers} from './customers-adapter.js'

async function getAllCustomers(filter) {

	const pageNumber = (!filter.page ? 1 : filter.page)
	const pageSize = (!filter.pageSize ? 10 : filter.pageSize)

	const filters = {};
	
	// Retorna um obj com o De/Para de campos entre o filtro da API e o Protheus  
	const mappingFields = Object.entries(mappingFieldsCustomers); 

	mappingFields.forEach(([fieldReq, fieldProtheus]) => {

		// Se um campo mapeado for enviado como parâmetro, ele é adicionado ao filtro
		if (filter[fieldReq]){
			if (fieldReq === 'name') {
				filters[fieldProtheus] = {value: `%${filter[fieldReq].trim()}%`, operator: 'LIKE'}
			} else {
				filters[fieldProtheus] = filter[fieldReq];
			}
}
	});

	return customersModel.searchAllCustomers(filters, pageNumber, pageSize)

}

export { getAllCustomers }