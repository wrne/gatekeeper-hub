import {ListenerMQ} from './infra/queue/queue-manager.js'

import { sendPriceTable } from './controllers/prices/prices-controller.js'
import { sendCustomer } from './controllers/customers/customers-controller.js'

export default () =>{
	const listeners = [
		{
			queue: 'price_tables',
			callback: sendPriceTable,
			frequency: 5000
		},
		{
			queue: 'customers',
			callback: sendCustomer,
			frequency: 10000
		}
	]

    console.log(`Ativando listeners de integração para ativação dos webhooks`);

	listeners.forEach(({queue, callback, frequency}) => {
		setInterval(() => {
			ListenerMQ(queue, callback);
		}
		, frequency);
	}
	);
	
	console.log(`Listeners de integração ativados`);

    // // Ativa Listener de tabelas de preço
    // const consumerPrice = ListenerMQ('price_tables',sendPriceTable);
    // const consumerCustomer = ListenerMQ('customers',sendCustomer);

}
