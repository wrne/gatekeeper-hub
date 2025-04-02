import axios from "axios";
import priceModel from "../../models/prices/prices-model.js";
import { mappingFieldsPrice } from "./prices-adapter.js";

async function getAllPriceTables(filter, params = {}) {
  const pageNumber = !filter.page ? 1 : filter.page;
  const pageSize = !filter.pageSize ? 10 : filter.pageSize;

  const filters = {};


  // Retorna um obj com o De/Para de campos entre o filtro da API e o Protheus
  const mappingFields = Object.entries(mappingFieldsPrice);

  mappingFields.forEach(([fieldReq, fieldProtheus]) => {
    // Se um campo mapeado for enviado como parâmetro, ele é adicionado ao filtro
    if (filter[fieldReq]) filters[fieldProtheus] = filter[fieldReq];
  });

  const withItems = params.withItems || false;

  return priceModel.searchAllPrices(filters, withItems, pageNumber, pageSize);
}

async function getProductPrice(filter) {
  return priceModel.searchProductPrice(filter);
}

export async function sendPriceTable(data) {

	let sucess = false
  console.log(`Sending price table: ${JSON.stringify(data)}`);

  const url = `${process.env.FARMI_URL_INTEGRATION}/price-tables`;

  
  try {
    const response = await axios.post(url, data);
    console.log("Price table sent successfully:", response.data);
	sucess = true
  } catch (error) {
    console.error("Error sending price table:", error.response?.data || error.message);
  }

  return sucess
}

export default { getAllPriceTables, getProductPrice };
