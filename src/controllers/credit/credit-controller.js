import creditModel from '../../models/credit/credit-model.js'
import {mappingFieldsCredit} from './credit-adapter.js'

async function getAllLimits(filter) {

	const pageNumber = (!filter.page ? 1 : filter.page)
	const pageSize = (!filter.pageSize ? 10 : filter.pageSize)

	const filters = {};
	
	// Retorna um obj com o De/Para de campos entre o filtro da API e o Protheus  
	const mappingFields = Object.entries(mappingFieldsCredit); 

	mappingFields.forEach(([fieldReq, fieldProtheus]) => {

		// Se um campo mapeado for enviado como parâmetro, ele é adicionado ao filtro
		if (filter[fieldReq])
			filters[fieldProtheus] = filter[fieldReq];

	});


	return creditModel.searchAllLimits(filters, pageNumber, pageSize)

}


export { getAllLimits }