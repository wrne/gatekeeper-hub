import {searchAllProducts} from '../../models/products/products-model.js'
import {mappingFieldsProducts} from './products-adapter.js'

async function getAllProducts(filter) {

	const pageNumber = (!filter.page ? 1 : filter.page)
	const pageSize = (!filter.pageSize ? 10 : filter.pageSize)

	const filters = {};
	filters['B1_TIPO'] = 'PA' // Tipo de produto
	filters['B1_GRUPO'] = {
		value: '800',
		operator: '<>'
	}
	
	// Retorna um obj com o De/Para de campos entre o filtro da API e o Protheus  
	const mappingFields = Object.entries(mappingFieldsProducts); 

	mappingFields.forEach(([fieldReq, fieldProtheus]) => {

		// Se um campo mapeado for enviado como parâmetro, ele é adicionado ao filtro
		if (filter[fieldReq])
			filters[fieldProtheus] = filter[fieldReq];

	});


	return searchAllProducts(filters, pageNumber, pageSize)

}


export { getAllProducts }