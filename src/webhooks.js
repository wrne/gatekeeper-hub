import {ListenerMQ} from './infra/queue/queue-manager.js'
import priceController from './controllers/prices/prices-controller.js'

export default () =>{

    console.log(`Ativando listeners de integração para ativação dos webhooks`);

    // Ativa Listener de tabelas de preço
    const consumerPrice = new ListenerMQ('price_tables',priceController.sendPriceTable);

}
