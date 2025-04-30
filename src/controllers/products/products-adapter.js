const mappingFieldsProducts = {
	alias: "B5_XPRINCI",
	group: "B1_GRUPO",
	package: "B1_XPREPROD"
}

const mappingDBFieldsProducts = {
	B1_COD: 'id',
	B1_DESC: 'description',
	B1_GRUPO: 'group',
	BM_DESC: 'groupDescription',
	B5_XPRINCI: 'alias',
	ZZ3_DESCPR: 'aliasDescription',
	B1_XPREPRO: 'package',
	B1_PE: 'leadTime,',
	B1_CONV: 'conversionFactor'
}

export {mappingFieldsProducts , mappingDBFieldsProducts}