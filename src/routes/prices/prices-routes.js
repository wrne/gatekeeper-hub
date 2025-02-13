import express from "express";
import priceController from "../../controllers/prices/prices-controller.js";

import { logMessage } from "../../utils/log-generator.js";

const router = express.Router();

/**
 * Rota de Consulta de Tabelas de Preço - Listagem de acordo com os filtros sem os itens
 */
router.get("/", async (req, res) => {
  try {
    const priceList = await priceController.getAllPriceTables(req.query);
    logMessage(`price list retrieved successful`);

    res.success(priceList, "consult proceed successful.");
  } catch (error) {
    res.error(500, error, "Failure on getting price");
  }
});

/**
 * Rota de Consulta de pedidos - Listagem de acordo com os filtros com os itens
 */
router.get("/items", async (req, res) => {
  try {
    const priceList = await priceController.getAllPriceTables(req.query, {
      withItems: true,
    });
    logMessage(`price List retrieved successful`);

    res.success(priceList, "consult proceed successful.");
  } catch (error) {
    res.error(500, error, "Failure on getting price");
  }
});

/**
 * Rota de Consulta de tabela de preço por ID. Retorna a tabela de preço com os itens
 */
router.get("/:table/items", async (req, res) => {
  try {
    const [price] = await priceController.getAllPriceTables(
      { table: req.params.table },
      { withItems: true }
    );
    logMessage(`price retrieved successful`);

    res.success(price, "consult proceed successful.");
  } catch (error) {
    res.error(500, error, "Failure on getting price");
  }
});

/**
 * Rota de Consulta de preço de um unico produto.
 */
router.get("/:table/item/:product", async (req, res) => {
  try {
	
    const [price] = await priceController.getProductPrice({
      table: req.params.table,
      product: req.params.product,
    });

    logMessage(`price retrieved successful`);

    res.success(price, "consult proceed successful.");
  } catch (error) {
    res.error(500, error, "Failure on getting price");
  }
});

export default router;
