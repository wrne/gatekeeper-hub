import axios from "axios";
import stocksModel from '../../models/availability/availability-model.js'

export async function getAvailabilityController(filter) {

	
	if (!!filter && !!filter.produtos && !!filter.tipo) {
				
		return (stocksModel.getAvailability(filter))
	}

	return {stocks: []}
		
}
