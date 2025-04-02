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

export function ListenerMQ(queueName, callback) {

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

				console.log(`[*] Consumidor iniciado. Aguardando mensagens na fila ${queueName}...`);

				channel.consume(queueName, async (msg) => {
					if (msg !== null) {
						const receivedObject = JSON.parse(msg.content.toString());
						console.log('[✔] Mensagem recebida:', receivedObject);

						// Chama a função de callback, passando a mensagem recebida
						if (await callback(receivedObject))
							console.log('[✔] Mensagem processada com sucesso');
							// Confirma que a mensagem foi processada com sucesso
							// channel.ack(msg);
						else
							console.log('[❌] Erro ao processar mensagem');


					}
				});



			});
		});

	} catch (error) {
		console.error('[❌] Erro ao conectar ao RabbitMQ:', error);
	}
	
}
