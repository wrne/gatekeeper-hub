import priceModel from '../../models/prices/prices-model.js'
import {mappingFieldsPrice} from './prices-adapter.js'

async function getAllPriceTables(filter, params = {}) {

	const pageNumber = (!filter.page ? 1 : filter.page)
	const pageSize = (!filter.pageSize ? 10 : filter.pageSize)

	const filters = {};
	
	// Retorna um obj com o De/Para de campos entre o filtro da API e o Protheus  
	const mappingFields = Object.entries(mappingFieldsPrice); 

	mappingFields.forEach(([fieldReq, fieldProtheus]) => {

		// Se um campo mapeado for enviado como parâmetro, ele é adicionado ao filtro
		if (filter[fieldReq])
			filters[fieldProtheus] = filter[fieldReq];

	});

	const withItems = params.withItems || false

	return priceModel.searchAllPrices(filters,withItems, pageNumber, pageSize)

}

async function getProductPrice(filter) {

	return priceModel.searchProductPrice(filter)

}

async function sendPriceTable(data){
	console.log(`Sending price table: ${JSON.stringify(data)}`);

}

export default { getAllPriceTables, getProductPrice, sendPriceTable }