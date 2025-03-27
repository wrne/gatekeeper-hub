import amqp from "amqplib/callback_api.js"

const amqpConnString = `amqp://${process.env.QUEUE_USER}:${process.env.QUEUE_PWD}@${process.env.QUEUE_HOST}`

export function publish(exchange, routingKey, message) {

	// console.log(`Connetion String with AMQP: amqp://${process.env.QUEUE_USER}:${process.env.QUEUE_PWD}@${process.env.QUEUE_HOST}`);

	amqp.connect(amqpConnString, function (error0, connection) {
		if (error0) {
			throw error0;
		}

		console.log(`Connected with AMQP service at ${process.env.QUEUE_HOST}`);
		connection.createChannel(function (error1, channel) {
			if (error1) {
				throw error1;
			}

			// channel.assertExchange(exchange, 'fanout', {
			// 	durable: true
			// });

			channel.publish(
				exchange,
				routingKey,
				Buffer.from(JSON.stringify(message)),
				{ persistent: true } // Marca a mensagem como persistente
			);

			console.log(" [x] Sent %s", JSON.stringify(message));
		});

	});

}

export class ListenerMQ {
	constructor(queueName, callback) {
		this.callback = callback; // Função de callback personalizada
		this.queueName = queueName;
		this.init();
	}

	async init() {
		try {
			// this.connection = await amqp.connect(amqpConnString);
			// this.channel = await this.connection.createChannel();
			// await this.channel.assertQueue(this.queueName, { durable: true });
			amqp.connect(amqpConnString,  (error0, connection) => {
				if (error0) {
					throw error0;
				}

				console.log(`Connected with AMQP service at ${process.env.QUEUE_HOST}`);
				connection.createChannel( (error1, channel) => {
					if (error1) {
						throw error1;
					}

					console.log('[*] Consumidor iniciado. Aguardando mensagens...');

					channel.consume(this.queueName, (msg) => {
						if (msg !== null) {
							const receivedObject = JSON.parse(msg.content.toString());
							console.log('[✔] Mensagem recebida:', receivedObject);

							// Chama a função de callback, passando a mensagem recebida
							this.callback(receivedObject);

							// Confirma que a mensagem foi processada com sucesso
							// this.channel.ack(msg);
						}
					});



				});
			});

		} catch (error) {
			console.error('[❌] Erro ao conectar ao RabbitMQ:', error);
		}
	}
}
