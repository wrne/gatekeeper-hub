import amqp from "amqplib/callback_api.js"
import 'dotenv/config'

/**
 * Função que cria a estrutura de fila no RabbitMQ.
 * No formato atual um Exchange de pedidos é criado. Ele deve ser durável para que mesmo que não haja subscriber ativo as mensagens não sejam perdidas.
 * O exchange de pedidos possui duas rotas: "agrega" e "simulador" para indicar as filas correspondentes e tratamento adequado para cada uma.
 */
export async function createQueuesStructure() {


	// Exchange de novos pedidos
	const exchangesDefault = [
		{
			name: 'farmi',
			bindindRouting: [
				{
					// Binding da fila dos pedidos da Agrega
					queue: "farmi_orders",
					routingKey: "farmi_orders"
				},
				{
					// Binding da fila dos pedidos do Simulador
					queue: "farmi_payments",
					routingKey: "farmi_payments"
				}
			]
		},
		{
			name: 'protheus_new_registries',
			bindindRouting: [
				{
					// Binding da fila de novas tabelas de preço
					queue: "price_tables",
					routingKey: "price_tables"
				},
				{
					// Binding da fila de novos clientes
					queue: "customers",
					routingKey: "customers"
				}
			]
		}
	]
	

	const amqpConnString = `amqp://${process.env.QUEUE_USER}:${process.env.QUEUE_PWD}@${process.env.QUEUE_HOST}`
	amqp.connect(amqpConnString, (err, connection) => {
		
		if (err) {
			console.error(`Erro ao conectar ao RabbitMQ [conn String: ${amqpConnString} ]:`, err);
			process.exit(1);
		}

		console.log(`RabbitMQ| MessageBroker conectado.`);
		
		connection.createChannel((err, channel) => {
			if (err) {
				console.error('Erro ao criar o canal:', err);
				process.exit(1);
			}
			
			console.log(`RabbitMQ| Channel criado.`);

			exchangesDefault.forEach((exchange) => {
				
				// Declarar um exchange durável
				channel.assertExchange(exchange.name, 'direct', { durable: true });
	
				// Binding das filas às RoutingKeys
				exchange.bindindRouting.forEach((binding) => {
	
					// Declarar uma fila durável
					channel.assertQueue(binding.queue, { durable: true });
	
					// Ligar a fila ao exchange
					channel.bindQueue(binding.queue, exchange.name, binding.routingKey);
	
					console.log(`RabbitMQ| Exchange "${exchange.name}" configurado com a rota ${binding.routingKey}.`);
				})
			})

		});
	});
}

createQueuesStructure();

setTimeout(function () {
	process.exit(0);
}, 1000);