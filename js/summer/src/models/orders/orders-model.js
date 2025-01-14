import dbConn from "../../infra/db/database-connection.js";

function searchAllOrders(filters, pageNumber, pageSize){

	const conn = new dbConn()
	const D_E_L_E_T_ = ''
	
	filters = {
		...filters,
		... { D_E_L_E_T_ }
	}
	
	return conn.pagedQuery(['Z2_NUM','Z2_EMISSAO','Z2_CLIENTE'], 'SZ2010', filters, 'R_E_C_N_O_', pageNumber, pageSize)

}

export default {searchAllOrders}