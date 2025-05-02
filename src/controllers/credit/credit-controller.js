import {searchAllLimits, getGuarantees, getMappingGuaranteesTypes} from '../../models/credit/credit-model.js'
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


	const groups = await searchAllLimits(filters, pageNumber, pageSize)
	
	filters["groups"] = groups.map( group => group.group)
	const guarantees = await getGuarantees(filters)// TODO: OBter as garantias e montar objeto de retorno com dados do LC e das garantias
	const mapGuaranteesTypes = await getMappingGuaranteesTypes()
	const result = groups.map(group => {
		const guaranteesOfGroup = guarantees.filter(guarantee => guarantee.group === group.group)
		let guaranteesOfGroupObj = {}
		guaranteesOfGroup.forEach(amountGuarantee => {
			guaranteesOfGroupObj[mapGuaranteesTypes[amountGuarantee.type.trim()]] = amountGuarantee.totalCredit
		});
		return {
			...group,
			composition: guaranteesOfGroupObj
		}
	})



	return result

}



export { getAllLimits }