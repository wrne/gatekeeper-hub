import paymentsModel from "../../models/payments/payments-model.js";
import { mappingFieldsPayments } from "./payments-adapter.js";

async function getAllPayments(filter) {
  const pageNumber = !filter.page ? 1 : filter.page;
  const pageSize = !filter.pageSize ? 10 : filter.pageSize;

  const filters = {};

  // Retorna um obj com o De/Para de campos entre o filtro da API e o Protheus
  const mappingFields = Object.entries(mappingFieldsPayments);

  mappingFields.forEach(([fieldReq, fieldProtheus]) => {
    // Se um campo mapeado for enviado como parâmetro, ele é adicionado ao filtro
    if (filter[fieldReq]) filters[fieldProtheus] = filter[fieldReq];
  });

  if (filter.hasOwnProperty("open")) {
    filters["E1_SALDO"] = {
      value: 0,
      operator: ">",
	  type: 'number'
    };
  }

  const payments = await paymentsModel.searchAllPayments(filters, pageNumber, pageSize);

	const returnPayments = payments.map((payment) => {
		const newPayment = {
			...payment
		}

		if(payment.balance > 0){
			if(payment.dueDate < new Date().toISOString().slice(0, 10).replace(/-/g, "")){
				newPayment["status"] = "overdue";
			}
			else{
				newPayment["status"] = "open";
			}
		} else {
			newPayment["status"] = "paid";
		}
		return newPayment
  })

  return returnPayments;

}

export { getAllPayments };
